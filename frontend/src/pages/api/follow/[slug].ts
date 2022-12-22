import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "~/serverless/utils/connectdb";
import { Comic } from "~/types";

const follow = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body, query } = req;
  const { slug, userId } = body;
  const { db } = await connectToDatabase();
  // console.log({ body });
  switch (method) {
    case "POST":
      try {
        await db.collection("watchlists").updateOne(
          {
            userId: body.userId,
            // "manga.slug": (body.manga as Comic).slug,
          },
          {
            $addToSet: {
              // userId:
              manga: { slug: body.manga.slug },
              // createdAt: new Date(Date.now()),
            },
          },
          { upsert: true }
        );

        res.status(201).json({
          success: true,
        });
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
      break;

    case "GET":
      try {
        const data = await db
          .collection("watchlists")
          .findOne({ userId, "details.name": slug });

        if (!data) return res.status(404).json({ message: "items not found" });

        return res.status(200).json({
          success: true,
          data,
        });
      } catch (err) {
        res.status(500).json(err);
      }
      break;

    case "DELETE":
      try {
        await db
          .collection("watchlists")
          .deleteOne({ userId, "details.name": slug });

        res.status(200).json({
          success: true,
        });
      } catch (err) {
        res.status(500).json(err);
      }
      break;

    default:
      res.status(500).json({
        message: "Method not matches",
      });
  }
};

export default follow;
/**
 *  {
 *  userId:'asdasasf'
 *  manga:[
 *  {slug:'nozomi-asdasd','lastedChapterReaded':'chap244-3'}
 *  ,{...}
 *  ]
 *
 *   }
 *
 *
 */
