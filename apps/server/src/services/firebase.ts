import { initializeApp, cert, getApps } from "firebase-admin/app";
import { env } from "process";
import { getMessaging } from "firebase-admin/messaging";

if (!getApps().length) {
  const serviceAccount = JSON.parse(
    Buffer.from(env.FIREBASE_SERVICE_ACCOUNT!, "base64").toString("utf8")
  );
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const firebase_messaging = getMessaging();

export { firebase_messaging };
