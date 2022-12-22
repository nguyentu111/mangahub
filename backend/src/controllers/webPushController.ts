// @ts-nocheck
import { NextFunction, Request, Response } from "express";
import webPush from "web-push";
import { config } from "dotenv";
import Subscriber from "../models/Subscriber.model";
import lhModel from "../models/LhModel";
import { isEmptyObject } from "../utils";

// const baseUrl = process.env.NT_SOURCE_URL as string;
// const Nt = NtModel.Instance(baseUrl);
config();
const lh = lhModel();
export default function webPushController() {
  const FE_URL = process.env.FE_URL as string;
  if (FE_URL) console.log(`Pussing for url: ${FE_URL}`);
  else console.log("missing FE_URL");
  return {
    info: async (req: Request, res: Response, next: NextFunction) => {
      const { comicSlug, userId } = req.body;
      //validate body
      if (!comicSlug || !userId) {
        return res.status(400).json({
          success: false,
          message: "missing payload",
        });
      }

      const existingSubscriber = await Subscriber.findOne({
        userId,
        subComics: { $elemMatch: { comicSlug: { $in: comicSlug } } },
        // identifications: { $elemMatch: { endpoint, p256dh, auth } },
      });
      if (!existingSubscriber) {
        return res.status(404).json({
          success: false,
          message: "can not found subscriber or comicSlug!",
        });
      }

      return res.status(200).json({
        success: true,
        message: "subscribed",
      });
    },

    subscribe: async (req: Request, res: Response, next: NextFunction) => {
      const { userId, comicSlug, endpoint, p256dh, auth } = req.body;
      //validate body
      if (!userId || !comicSlug || !endpoint || !p256dh || !auth) {
        return res.status(400).json({
          message: "missing payload",
        });
      }

      //avoid to duplicate identifications
      const existingIdentifications = await Subscriber.findOne({
        userId,
        identifications: { $elemMatch: { endpoint, p256dh, auth } },
      });
      //check exist comic in db:
      // const existingComic = await Comic.findById(comicId);

      //missing comic -> get comic -> insert
      // if (!existingComic) {
      //   const comic = await Nt.getLatestChapter(comicId);

      //   //check comic data get successful
      //   if (
      //     comic &&
      //     Object.keys(comic).length === 0 &&
      //     Object.getPrototypeOf(comic) === Object.prototype
      //   ) {
      //     console.error("missing comic");
      //     return res.status(404).json({
      //       success: false,
      //       message: "can not found comic",
      //     });
      //   }

      //   await Comic.create({
      //     _id: comicId,
      //     title: comic.title,
      //     latestChapter: comic.latestChapter,
      //     cover: comic.cover,
      //   });
      // }
      if (!existingIdentifications) {
        //update user to subscribers
        await Subscriber.updateOne(
          { userId },
          {
            userId,
            $addToSet: {
              identifications: {
                endpoint,
                p256dh,
                auth,
              },
              subComics: {
                comicSlug: comicSlug,
                lastestChap: (await lh.getComic(comicSlug))?.chapters[0].slug,
              },
            },
          },
          { upsert: true }
        );
      } else {
        await Subscriber.updateOne(
          { userId },
          {
            userId,
            $addToSet: {
              subComics: {
                comicSlug: comicSlug,
                lastestChap: (await lh.getComic(comicSlug))?.chapters[0].slug,
              },
            },
          },
          { upsert: true }
        );
      }

      return res.status(200).json({
        success: true,
      });
    },

    unsubscribe: async (req: Request, res: Response, next: NextFunction) => {
      const { comicSlug, userId } = req.body;

      //validate body
      if (!comicSlug || !userId) {
        return res.status(400).json({
          success: false,
          message: "missing payload",
        });
      }

      const existingSubscriber = await Subscriber.findOne({
        userId,
        // subComics: { $elemMatch: { $in: comicId } },
        subComics: { $elemMatch: { comicSlug: { $in: comicSlug } } },
      });

      if (!existingSubscriber) {
        return res.status(404).json({
          success: false,
          message: "can not found subscriber or comicSlug!",
        });
      }

      const { subComics } = existingSubscriber;
      existingSubscriber.subComics = subComics.filter(
        (comic) => comic.comicSlug !== comicSlug
      );

      if (existingSubscriber.subComics.length !== 0) {
        await existingSubscriber.save();
      } else {
        await existingSubscriber.remove();
      }

      return res.status(200).json({
        success: true,
      });
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
      //   const subscribers = await Subscriber.find(
      //     {},
      //     { __v: 0, createdAt: 0, updatedAt: 0 }
      //   ).populate("subComics");

      //   const grouped = subscribers.reduce(
      //     (acc, current) => {
      //       current.subComics.forEach((item) => {
      //         if (
      //           //@ts-ignore
      //           !acc.find((i) => i?.comicId === String(item?._id))
      //         ) {
      //           acc.push({
      //             //@ts-ignore
      //             comicId: String(item?._id),
      //             latestChapterTitle:
      //               //@ts-ignore
      //               item?.latestChapter?.chapterTitle,
      //             subscriptions: [],
      //           });
      //         }
      //       });

      //       current.subComics.forEach((item) => {
      //         const res = acc.find(
      //           //@ts-ignore
      //           (i) => i?.comicId === String(item?._id)
      //         );
      //         //@ts-ignore
      //         res?.subscriptions.push(...current.identifications);
      //       });

      //       return acc;
      //     },
      //     [] as {
      //       comicId: string;
      //       latestChapterTitle: string;
      //       subscriptions: Subscription[];
      //     }[]
      //   );

      //   await Promise.allSettled(
      //     grouped.map(async (item) => {
      //       try {
      //         const existingComic = await Nt.getLatestChapter(item.comicId);

      //         if (
      //           !isEmptyObject(existingComic) &&
      //           existingComic.latestChapter?.chapterTitle !==
      //             item.latestChapterTitle
      //         ) {
      //           await Comic.updateOne(
      //             {
      //               _id: item.comicId,
      //             },
      //             {
      //               latestChapter: existingComic.latestChapter,
      //             }
      //           );

      //           await Promise.allSettled(
      //             item.subscriptions.map(async (sub) => {
      //               try {
      //                 await webPush.sendNotification(
      //                   {
      //                     endpoint: sub.endpoint,
      //                     keys: {
      //                       auth: sub.auth,
      //                       p256dh: sub.p256dh,
      //                     },
      //                   },
      //                   JSON.stringify({
      //                     title: `${existingComic?.title} đã có chap mới`,
      //                     body: existingComic.latestChapter?.chapterTitle,
      //                     badge:
      //                       "https://res.cloudinary.com/lee1002/image/upload/v1658088029/personal/xykwxyxuhnmpg3nxgvrv.png",
      //                     icon: "https://res.cloudinary.com/lee1002/image/upload/v1658088029/personal/xykwxyxuhnmpg3nxgvrv.png",
      //                     image: existingComic.cover,
      //                     data: {
      //                       url: `${FE_URL}/comic/details/${item.comicId}`,
      //                     },
      //                   })
      //                 );
      //               } catch (error: any) {
      //                 if (
      //                   error?.body?.includes("expire") ||
      //                   error?.body?.includes("unsubscribe")
      //                 ) {
      //                   console.log(":: ", error);

      //                   await Subscriber.deleteOne({
      //                     identifications: {
      //                       $elemMatch: {
      //                         endpoint: sub?.endpoint,
      //                         p256dh: sub?.p256dh,
      //                         auth: sub?.auth,
      //                       },
      //                     },
      //                   });
      //                 }
      //               }
      //             })
      //           );
      //         }
      //       } catch (err) {
      //         console.log(":: ", err);
      //         next();
      //       }
      //     })
      //   );

      //   return res.status(200).json({
      //     message: "Ok",
      //   });
      //////////////////////////////////////////////////////////////////////////////////////////
      // const subscribers = await Subscriber.find(
      //   {}
      //   // { __v: 0, createdAt: 0, updatedAt: 0 }
      // ).lean();
      // subscribers.forEach((subscriber: ISubscriber) => {
      //   subscriber.subComics.forEach(({ comicSlug, lastestChap }) =>
      //     notifyNewChapToUser({ subscriber, comicSlug, lastestChap })
      //   );
      // });
      //////////////////////////////////////////////////////////////////////////////////////////
      const subscribers = await Subscriber.find({}).lean();
      const grouped = subscribers.reduce(
        (acc, subscriber) => {
          subscriber.subComics.forEach((subComic) => {
            if (!acc.find((i) => i?.comicSlug === String(subComic.comicSlug))) {
              acc.push({
                comicSlug: subComic.comicSlug,
                lastestChap: subComic.lastestChap,
                subscriptions: [],
              });
            }
          });
          subscriber.subComics.forEach((item) => {
            const res = acc.find(
              //@ts-ignore
              (i) => i?.comicSlug === String(item?.comicSlug)
            );
            //@ts-ignore
            res?.subscriptions.push(...subscriber.identifications);
          });
          return acc;
        },
        [] as {
          comicSlug: string;
          lastestChap: string;
          subscriptions: {
            endpoint;
            p256dh;
            auth;
          }[];
        }[]
      );

      // try {
      //   await webPush.sendNotification(
      //     {
      //       endpoint:
      //         "https://wns2-pn1p.notify.windows.com/w/?token=BQYAAAB%2fSBbw%2bovwyDty8BEZfqrmf3FSONB1RbWy9oBiSaUfn%2bqr%2ffrEXkBvQtQC3jAfeq9GEChGW4Pj%2fYPWVDtsThEs6Cgafr58wBMJQh0f8HouaSnXEfF5885W8LSTIT%2fboWhDqyhU64XgBS3EobmQo8G2G8Xr%2bQt3cnXX1pGLyr9RdcsEg25bIcpymvM%2b1gmMLmIYrBXtgyPemxifOwvLTlc0CFws7IGr9ZiqHNsQP%2bTkbP8Z7SFug9rtvpk7upVfam0ZCwdSwwTwIK%2fpgEav4b%2b7c%2fPJphn2dAUoPocgU2%2b5qANJ1glahr26jrmXIr2dhYo%3d",
      //       keys: {
      //         auth: "FRL0JGFzDKF4uzc7aGiccA",
      //         p256dh:
      //           "BIF1SqHhQ5gpQTVMFEvP1vTPTV6RL3KNlCBNWkANVkLnhBx2ATwsvPBDjvMWW33v8GymttDUspTIJlQZf7i-2dY",
      //       },
      //     },
      //     JSON.stringify({
      //       title: `SILENT MIYASHITA-SAN'S SEXY CHANNEL đã có chap mới`,
      //       body: "đọc ngay chap 112",
      //       // badge:
      //       //   "",
      //       // icon: "https://res.cloudinary.com/lee1002/image/upload/v1658088029/personal/xykwxyxuhnmpg3nxgvrv.png",
      //       image:
      //         "https://www.truyentranhlh.net/storage/images/raw/b8298c80-82d5-4418-b45a-63c1c4ae20a2.jpg",
      //       data: {
      //         url: `${FE_URL}/comic/details/${gruop[0].comicSlug}`,
      //       },
      //     })
      //   );
      // } catch (er) {
      //   if (
      //     error?.body?.includes("expire") ||
      //     error?.body?.includes("unsubscribe")
      //   ) {
      //     console.log(":: ", error);

      //     await Subscriber.deleteOne({
      //       identifications: {
      //         $elemMatch: {
      //           endpoint: sub?.endpoint,
      //           p256dh: sub?.p256dh,
      //           auth: sub?.auth,
      //         },
      //       },
      //     });
      //   }
      // }

      await Promise.allSettled(
        grouped.map(async (item) => {
          try {
            const existingComic = await lh.getComic(item.comicSlug);

            if (
              !isEmptyObject(existingComic) &&
              existingComic?.chapters[0].slug !== item.lastestChap
            ) {
              //////////
              await Promise.allSettled(
                item.subscriptions.map(async (sub) => {
                  try {
                    // update subscribers -> subcomic -> latestchap
                    Subscriber.updateOne(
                      {
                        identifications: {
                          $elemMatch: {
                            endpoint: sub?.endpoint,
                            p256dh: sub?.p256dh,
                            auth: sub?.auth,
                          },
                        },
                        "subComics.comicSlug": item.comicSlug,
                      },
                      {
                        "subComics.lastestChap":
                          existingComic?.chapters[0].slug,
                      }
                    );
                    // ///////////
                    await webPush.sendNotification(
                      {
                        endpoint: sub.endpoint,
                        keys: {
                          auth: sub.auth,
                          p256dh: sub.p256dh,
                        },
                      },
                      JSON.stringify({
                        title: `${existingComic?.title} đã có chap mới`,
                        body: existingComic?.chapters[0].title,
                        // badge:
                        //   "https://res.cloudinary.com/lee1002/image/upload/v1658088029/personal/xykwxyxuhnmpg3nxgvrv.png",
                        // icon: "https://res.cloudinary.com/lee1002/image/upload/v1658088029/personal/xykwxyxuhnmpg3nxgvrv.png",
                        image: existingComic?.image,
                        data: {
                          url: `${FE_URL}/comic/details/${item.comicId}`,
                        },
                      })
                    );
                  } catch (error: any) {
                    if (
                      error?.body?.includes("expire") ||
                      error?.body?.includes("unsubscribe")
                    ) {
                      console.log(":: ", error);

                      await Subscriber.deleteOne({
                        identifications: {
                          $elemMatch: {
                            endpoint: sub?.endpoint,
                            p256dh: sub?.p256dh,
                            auth: sub?.auth,
                          },
                        },
                      });
                    }
                  }
                })
              );
            }
          } catch (err) {
            console.log(":: ", err);
            next();
          }
        })
      );

      return res.status(200).json({
        message: "Ok",
      });
    },
  };
}
