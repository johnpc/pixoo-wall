/**
 * Constant partition key for the `listMessagesByDate` secondary index.
 *
 * Every Message row carries the same `type` value so that a single DynamoDB
 * Query (sorted by `createdAt`) can return the newest messages instead of
 * paginating the whole table. Shared by the schema, the web UI, the Pixoo
 * updater, and the daily joke Lambda; kept free of backend imports so it is
 * safe to bundle into the browser.
 */
export const MESSAGE_TYPE = "message";
