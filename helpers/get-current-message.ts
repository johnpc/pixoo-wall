import { Schema } from '@/amplify/data/resource';
import { generateClient } from 'aws-amplify/api';
import { Amplify } from 'aws-amplify';
import config from '../amplifyconfiguration.json';
Amplify.configure(config);
const client = generateClient<Schema>();

export const getCurrentMessage = async () => {
	// TODO add @index to sort by and only fetch most recent message
	// https://docs.amplify.aws/react/build-a-backend/graphqlapi/best-practice/query-with-sorting/
	const {data, errors} = await client.models.Message.list();
	console.log({data, errors});
	const mostRecentMessage = data.sort((a, b) => new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() ? 1 : -1).pop();
	console.log({mostRecentMessage});
	return mostRecentMessage;
}