/**
 * One-off backfill: stamp `type = MESSAGE_TYPE` onto every Message row that
 * predates the `listMessagesByDate` GSI, so historical messages appear in the
 * index (the web UI's "Previous messages" list reads from it).
 *
 * Run ONLY after the schema change has deployed (the GSI must exist first):
 *   AWS_PROFILE=personal npx tsx scripts/backfill-message-type.ts
 *
 * Idempotent: scans for rows missing `type` and writes conditionally, so a
 * re-run (or a concurrent create) never clobbers an existing value.
 */
import {
  DynamoDBClient,
  ScanCommand,
  UpdateItemCommand,
  type AttributeValue,
} from "@aws-sdk/client-dynamodb";
import { MESSAGE_TYPE } from "../amplify/data/message-type";

const TABLE_NAME =
  process.env.MESSAGE_TABLE_NAME ?? "Message-wh5mqozxmrfvfdjhiz2mghbn2m-NONE";
const REGION = process.env.AWS_REGION ?? "us-west-2";
const DRY_RUN = process.argv.includes("--dry-run");

const dynamo = new DynamoDBClient({ region: REGION });

async function* scanMissingType(): AsyncGenerator<string> {
  let exclusiveStartKey: Record<string, AttributeValue> | undefined;
  do {
    const page = await dynamo.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        ProjectionExpression: "id",
        FilterExpression: "attribute_not_exists(#type)",
        ExpressionAttributeNames: { "#type": "type" },
        ExclusiveStartKey: exclusiveStartKey,
      }),
    );
    for (const item of page.Items ?? []) {
      const id = item.id?.S;
      if (id) yield id;
    }
    exclusiveStartKey = page.LastEvaluatedKey;
  } while (exclusiveStartKey);
}

const stampType = async (id: string): Promise<void> => {
  await dynamo.send(
    new UpdateItemCommand({
      TableName: TABLE_NAME,
      Key: { id: { S: id } },
      UpdateExpression: "SET #type = :type",
      ConditionExpression: "attribute_not_exists(#type)",
      ExpressionAttributeNames: { "#type": "type" },
      ExpressionAttributeValues: { ":type": { S: MESSAGE_TYPE } },
    }),
  );
};

const main = async (): Promise<void> => {
  console.log(
    `Backfilling ${TABLE_NAME} (${REGION})${DRY_RUN ? " [dry run]" : ""}`,
  );
  let updated = 0;
  for await (const id of scanMissingType()) {
    if (!DRY_RUN) await stampType(id);
    updated += 1;
    if (updated % 100 === 0) console.log(`  ${updated} rows...`);
  }
  console.log(
    `${DRY_RUN ? "Would update" : "Updated"} ${updated} rows with type="${MESSAGE_TYPE}"`,
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
