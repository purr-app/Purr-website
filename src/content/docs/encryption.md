---
title: Encrypted storage
description: Keep sensitive response data encrypted on your machine.
order: 7
---

## Response storage

Store response data encrypted on your machine so local API history does not have to sit around as readable plaintext.

## Local workflow

Response stream → encryption → local storage.

Purr keeps the encryption root in its application data with permissions limited to the current macOS user. An existing beta installation that used Keychain migrates that key once so encrypted history remains readable; fresh installations do not request a Keychain password when the app opens.

[Explore encrypted storage](/#encryption).
