import Airtable from "airtable";
export const airtableBase = new Airtable({
  apiKey: process.env.API_KEY_AIRTABLE,
}).base("appg6GzDgX5PzzXoP");
