# QR Code Scanner Pro React Native App

A fast, reliable, and intuitive mobile application for scanning various types of QR codes and taking immediate, context-relevant actions based on the scanned content.

## Features

-   **Fast QR Code Scanning**: Real-time QR code detection using the device camera
-   **Intelligent Content Detection**: Automatically identifies QR code types (URL, Wi-Fi, Contact, etc.)
-   **Context-Aware Actions**: Presents relevant action buttons based on the detected content type
-   **Local History Storage**: Maintains a searchable history of scanned codes
-   **Privacy-Focused**: Processes all data locally on the device
-   **Clean, Minimalist UI**: Intuitive interface with smooth animations

## Supported QR Code Types

-   URLs (websites)
-   Plain text
-   Wi-Fi network credentials
-   Contact information (vCard/meCard)
-   Geographic locations
-   SMS messages
-   Phone numbers
-   Email addresses

## Technologies Used

-   React Native with Expo
-   TypeScript
-   react-native-vision-camera for QR code scanning
-   react-native-mmkv for local storage
-   NativeWind for styling
-   react-native-reanimated for animations
-   Sentry for error monitoring

## Getting Started

### Prerequisites

-   Node.js (v16 or newer)
-   npm or yarn
-   Expo CLI
-   iOS Simulator or Android Emulator (or physical device)

### Installation

1. Clone the repository:

    ```
    git clone https://github.com/chirag127/QR-Code-Scanner-Pro-React-Native-app.git
    cd QR-Code-Scanner-Pro-React-Native-app
    ```

2. Install dependencies:

    ```
    npm install
    ```

3. Start the development server:

    ```
    npm start
    ```

4. Run on iOS or Android:
    ```
    npm run ios
    ```
    or
    ```
    npm run android
    ```

## Usage

1. Open the app and grant camera permission when prompted
2. Point your camera at a QR code
3. The app will automatically detect and scan the QR code
4. View the decoded content and available actions
5. Tap on an action button to perform the corresponding action
6. Access your scan history from the History tab

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Chirag Singhal
