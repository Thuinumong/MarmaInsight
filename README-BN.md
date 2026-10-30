# MarmaInsight — Website + Installable App (PWA)

এই প্রজেক্টটি একটি responsive website এবং installable Progressive Web App (PWA)। একই website PC, Android ও iPhone/iPad-এ ব্যবহার করা যাবে। এটি এখনই Play Store/App Store-এর native app package নয়।

## ফাইলসমূহ
- `index.html` — website interface
- `styles.css` — responsive design
- `app.js` — Firebase Authentication, Google sign-in, Firestore content
- `firebase-config.js` — Firebase web configuration
- `manifest.json` — PWA app name, display mode ও icons
- `sw.js` — service worker ও basic offline shell cache
- `assets/` — মূল icon, favicon, Android/desktop PWA icons এবং iOS touch icon
- `firestore.rules`, `storage.rules` — Firebase security rules templates

## GitHub Pages deploy
1. Repository-র root-এ সব ফাইল upload করো; `index.html` root-এ থাকতে হবে।
2. Repository → Settings → Pages → Deploy from a branch → `main` → `/ (root)` → Save।
3. Publish হলে URL হবে `https://thuinumong.github.io/MarmaInsight/`।
4. Firebase Console → Authentication → Settings → Authorized domains-এ `thuinumong.github.io` যোগ করো।

## Firebase setup
1. Firebase Console-এ `marmainsight` project খোলো।
2. Authentication → Sign-in method-এ Google provider Enable করো। প্রয়োজনে Email/Password-ও Enable করো।
3. Authentication → Settings → Authorized domains-এ `thuinumong.github.io` যোগ করো।
4. Firestore Database তৈরি করে `firestore.rules` যাচাই করে Publish করো।
5. Admin custom claim trusted Admin SDK/Cloud Functions environment থেকে দিতে হবে; browser থেকে কাউকে admin করা যাবে না।

## Install করার নিয়ম
### Android (Chrome)
Website URL খোলো → browser menu (⋮) → Install app অথবা Add to Home screen।

### iPhone/iPad (Safari)
Website URL Safari-তে খোলো → Share → Add to Home Screen → Add। iOS-এ Safari ব্যবহার করাই সবচেয়ে নির্ভরযোগ্য।

### Windows/macOS/Linux (Chrome বা Edge)
Website খোলো → address bar-এর install icon অথবা browser menu → Install MarmaInsight।

## গুরুত্বপূর্ণ
- PWA-তে একই responsive website app-এর মতো Home Screen/desktop-এ install হবে।
- Play Store বা Apple App Store-এ আলাদা native app প্রকাশ করতে হলে পরে Android TWA/Capacitor এবং iOS build/signing/store review করতে হবে। iOS native build-এর জন্য সাধারণত macOS ও Xcode দরকার।
- Service worker offline-এ মূল interface cache করে; Firebase-এর live data ও login ইন্টারনেট ছাড়া কাজ করবে না।
- Firebase config browser-এ থাকে; database নিরাপত্তা অবশ্যই Firestore/Storage Security Rules দিয়ে নিশ্চিত করতে হবে।
- Admin claim উদাহরণ: `await getAuth().setCustomUserClaims("USER_UID_HERE", { admin: true });` — এটি শুধু trusted server/Admin SDK environment-এ চালাতে হবে। Admin SDK private key কখনো GitHub-এ upload করবে না।

## বর্তমান starter-এর সীমা
এতে basic login, Google sign-in, Firestore content display, basic community post এবং admin claim-ভিত্তিক content management আছে। Comments, likes, moderation queue, profile management, image upload UI, chat, push notification, analytics, abuse reporting এবং store packaging এখনো আলাদা development প্রয়োজন।
