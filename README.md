# HashChat

HashChat (`#Chat`) is a cross-platform mobile app by [Samuel Mensah](https://github.com/simiel) for Ghanaian adolescents who want straightforward, age-appropriate sexual and reproductive health information, including teens who are visually or hearing impaired. A reader can ask a question in a chat that carries their age, gender, and disability into the prompt, or browse a bundled library of several thousand questions and answers by topic and subtopic.

## Features

- **Landing screen.** The entry screen introduces the app as “#Chat,” with the line “Empower Your Mind: AI Support for Teens.”
- **Onboarding profile.** A form collects age, gender (male or female), and disability (none, visual, or hearing) with `react-hook-form` and native pickers, then stores the profile on the device.
- **Guided chat.** The Home tab sends the conversation to OpenAI (`gpt-3.5-turbo-16k`). The system prompt asks the model to answer as an expert on Ghanaian adolescent sexual and reproductive health, and to keep replies safe, concise, precise, relevant, and age-appropriate for adolescents who are visually or hearing impaired. The saved age, gender, and disability travel with that prompt. Completions use a 150-token cap and a temperature of 0.7. The transcript is kept on device; sign-out clears the transcript and the onboarding flag.
- **Offline Q&A library.** The QAs tab reads `assets/fulldata.json` on device: 5,536 entries, each with a topic, subtopic, question (`questions_text`), and answer (`Answers`). The named content is 18 topics, and each topic has 18 subtopics. Choosing a topic opens its subtopics; choosing a subtopic opens questions whose answers expand and collapse in place.
- **Two-tab shell.** Home is the chat. QAs is the offline library. Opening Home with no saved profile routes the user through onboarding. The Q&A tab is available as soon as the tabs load.

### Offline topics

Education and Empowerment, Global Perspectives on ASRH, Mental Health, Economic Empowerment, Sexual and Reproductive Rights, Media Literacy, Peer Pressure and Decision-Making, Gender and Sexual Identity, Puberty Education, Reproductive Health Services, Sexual Education, Crisis Intervention and Support, Access to Healthcare, Legal and Ethical Considerations, Preventing Sexual Violence, Social and Cultural Context, Parental Communication, and STI/HIV Prevention and Education.

## Tech stack

- **App:** Expo SDK 51, React Native 0.74, React 18.2, TypeScript 5.3 with `strict`
- **Navigation:** Expo Router 3, file-based routes, and the `typedRoutes` experiment
- **Chat:** OpenAI Node SDK 4, model `gpt-3.5-turbo-16k`
- **On-device storage:** AsyncStorage keys `userData`, `onboardingCompleted`, and `messages`
- **Forms and UI:** `react-hook-form`, `@react-native-picker/picker`, `react-native-collapsible`, and React Native `StyleSheet`
- **Also installed:** NativeWind 2 and Tailwind CSS 3, plus React Native Reanimated, Gesture Handler, Screens, and Safe Area Context
- **Build:** EAS Build profiles in `eas.json` — Android APK preview, Android release assemble, development client, internal distribution, and production
- **Tests:** Jest with the `jest-expo` preset

The Android application id is `com.simiel.HashChatx`. iOS is configured for iPhone and iPad. Web uses the Metro bundler with static output. The Expo config locks orientation to portrait, points the icon and splash screen at `assets/images/hashtag.png`, and sets `userInterfaceStyle` to `automatic`. Screen colors in the product UI are fixed in `StyleSheet`s.

## Architecture

HashChat is a single Expo application. Expo Router maps files under `app/` to screens. The `@/*` path alias resolves to the project root.

```
app/
  _layout.tsx                 Root stack. Holds the splash screen until the SpaceMono font loads.
  index.tsx                   Landing screen.
  onboarding.tsx              Profile form. Writes the profile to AsyncStorage.
  (tabs)/
    _layout.tsx               Tabs: Home and QAs.
    text.tsx                  Chat screen. Owns the OpenAI client and the transcript.
    (offline)/
      _layout.tsx             Stack for the offline library.
      index.tsx               Distinct topics from the JSON corpus.
      subtopic/[name].tsx     Subtopics for the selected topic.
      QA.tsx                  Questions and answers, expanded with Collapsible.
assets/fulldata.json          Offline corpus.
components/                   Expo starter theme components (ThemedText, ParallaxScrollView, and others).
hooks/  constants/            Color-scheme helpers used by those starter components.
eas.json                      EAS Build profiles.
```

On the first chat session the screen seeds the transcript with the system prompt and a user turn built from the stored profile (`Gender`, `Age`, `Disability`). Each new question and reply is appended, and the full list is written back to AsyncStorage. System turns are left out of the on-screen list. User bubbles and assistant bubbles render in a `FlatList` that scrolls to the latest message.

The offline screens load the same JSON module and filter it in memory. Topics are the distinct `TOPIC` values, the dynamic `subtopic/[name]` route lists `SUBTOPIC` values for that topic, and `QA` filters on both `topic` and `subtopic` query params.

`components/`, `hooks/`, and `constants/` come from the `create-expo-app` template: light and dark color tokens, themed text and views, and a `ThemedText` snapshot test. HashChat screens style themselves with `StyleSheet`. NativeWind is registered in `babel.config.js`. `tailwind.config.js` still uses the template content globs, including the `<custom directory>` placeholder.

The onboarding check in the root layout is commented out. The chat screen performs that check: when `onboardingCompleted` is missing, it replaces the route with `/onboarding`.

## Getting started

**Prerequisites:** Node.js and npm. A device or simulator run also needs [Expo Go](https://expo.dev/go), or Android Studio / Xcode for the platform scripts below. `npm run ios` expects a macOS host.

```bash
npm install
npm start
```

`npm start` runs `expo start`. These scripts are defined in `package.json`:

| Command | Script | What it does |
| --- | --- | --- |
| `npm run android` | `expo start --android` | Opens the app on Android |
| `npm run ios` | `expo start --ios` | Opens the iOS simulator |
| `npm run web` | `expo start --web` | Opens the web target |
| `npm test` | `jest --watchAll` | Runs Jest in watch mode |
| `npm run lint` | `expo lint` | Runs the Expo linter |

`npm test` executes the checked-in snapshot test for the starter `ThemedText` component (`components/__tests__/ThemedText-test.tsx`). The repository does not include an ESLint config file.

**Environment variables:** none are defined. There is no `.env` file, and the app does not read `process.env`. The OpenAI client in `app/(tabs)/text.tsx` is constructed with an API key literal in that file. The key is omitted from this README. Rotate it and move it out of the source tree before distributing a build.

`npm run reset-project` is the `create-expo-app` helper (`scripts/reset-project.js`). It moves `app/` to `app-example/` and replaces it with a blank screen, which removes the HashChat routes.

`eas.json` defines build profiles for a preview Android APK, an Android release assemble, a development client, internal distribution, and production. The Expo project id lives under `extra.eas` in `app.json`. A store listing or deployed URL is not recorded in this repository.

## Project status

Prototype, version 1.0.0. The app was generated with `create-expo-app` on 22 July 2024, and the chat, onboarding flow, and offline library were added in commits through 30 July 2024. No course, capstone, or competition is named in the repository, and the repo does not include evaluation scores for the chat or the corpus.

## What this demonstrates

HashChat is a complete client-side product. The navigation composes a root stack, a tab navigator, a nested stack, and a dynamic subtopic route. Profile data and the full chat transcript persist locally and are replayed as model context, while a separate 5,536-entry library answers the same domain from bundled JSON, grouped into 18 topics and 324 subtopics. The prompt, token cap, and temperature are explicit in the chat screen, and the profile fields (age, gender, disability) are part of the request rather than an afterthought. Strict TypeScript, the `@/*` alias, Expo typed routes, `react-hook-form`, and an EAS Build matrix (APK, internal distribution, development client, and production) are all wired in the project.
