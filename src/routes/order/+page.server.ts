import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {parseSpreadsheet} from "$lib/spreadsheet/parse-spreadsheet";
import {getAuthToken} from "$lib/server/getAuthToken";
import { google } from "googleapis";
import {
	GOOGLE_PRIVATE_KEY,
	GOOGLE_PROJECT_ID,
	GOOGLE_CLIENT_EMAIL,
	GOOGLE_SHEET_ID
} from '$env/static/private';
import type { FoodItem } from '$lib/utils/local-storage';

export const load = (async ({ params }) => {
	try {
        const auth = await getAuthToken();
        const sheets = google.sheets({ version: "v4", auth });

        const spreadsheetId = GOOGLE_SHEET_ID;

        if (!spreadsheetId) {
          throw new Error("No spreadsheet id found.");
        }

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: "FoodItems",
          });

          if (!response.data.values) {
            throw new Error("No data found.");
          }
          const [header, ...data] = response.data.values;

          return {foodItems: parseSpreadsheet<FoodItem>(data, header)};
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          return { message: error.message };
        } else {
          return { message: "Something went wrong." };
        }
      }
}) satisfies PageServerLoad;
