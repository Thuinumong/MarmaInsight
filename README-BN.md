# MarmaInsight — Starter Project

এই প্রজেক্টে **Language / Dictionary / Translator** মডিউল রাখা হয়নি। এটি Marma community, culture, history, stories, events, news ও community post-এর জন্য।

## ফোল্ডারের ফাইল
- `index.html` — ওয়েবসাইটের পেজ ও UI
- `styles.css` — PC, tablet, Android ও iPhone responsive design
- `app.js` — Firebase Authentication, Firestore content load/publish
- `firebase-config.js` — Firebase project configuration
- `manifest.json`, `sw.js` — PWA install ও basic offline cache
- `firestore.rules`, `storage.rules` — database ও file access rules
- `assets/icon.png` — আপনার দেওয়া MarmaInsight icon

## চালু করার ধাপ
1. Firebase Console-এ project তৈরি করো: https://console.firebase.google.com/
2. Project settings > General > Your apps থেকে Web App তৈরি করে `firebase-config.js`-এ config বসাও।
3. Authentication > Sign-in method থেকে **Email/Password** চালু করো।
4. Firestore Database তৈরি করো।
5. Firestore Rules-এ `firestore.rules`-এর নিয়ম publish করো।
6. Storage ব্যবহার করলে `storage.rules` publish করো।
7. ফাইলগুলো Firebase Hosting-এ deploy করো। Local file হিসেবে `file://` দিয়ে চালালে Firebase module/PWA ঠিকমতো কাজ নাও করতে পারে; local server বা Hosting ব্যবহার করো।

## Admin নিরাপত্তা — জরুরি
শুধু UI থেকে কাউকে Admin করা যাবে না। Admin custom claim Firebase Admin SDK দিয়ে trusted server / Cloud Functions থেকে দিতে হবে। উদাহরণ (শুধু trusted environment-এ চালাবে):

```js
await getAuth().setCustomUserClaims("USER_UID_HERE", { admin: true });
```

তারপর ওই user sign out করে আবার sign in করবে। `USER_UID_HERE`-এর জায়গায় Admin-এর Firebase Auth UID বসাতে হবে। Admin SDK কখনো browser-এ রাখবে না।

## সীমাবদ্ধতা
এটি একটি functional starter, সম্পূর্ণ production platform নয়। এতে basic sign-in, community post, admin publish/edit/delete এবং public content display আছে। Edit করার জন্য বর্তমানে title ও description prompt ব্যবহার করা হয়েছে। Comments, likes, moderation queue, profile management, image upload UI, chat, push notification, analytics, abuse reporting ও app-store packaging পরবর্তী ধাপে যোগ করতে হবে।

## Android / iOS
এটি installable PWA হিসেবে compatible browser-এ Add to Home Screen করা যাবে। Play Store / App Store-এ native listing দিতে হলে পরে Android TWA/Capacitor বা Flutter wrapper, signing, privacy policy ও store review লাগবে।
