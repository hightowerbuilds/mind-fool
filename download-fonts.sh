#!/bin/bash

# Create fonts directory if it doesn't exist
mkdir -p public/fonts

# Download JetBrains Mono fonts
curl -L "https://github.com/JetBrains/JetBrainsMono/releases/download/v2.304/JetBrainsMono-2.304.zip" -o jetbrains-mono.zip

# Unzip the fonts
unzip -j jetbrains-mono.zip "fonts/ttf/JetBrainsMono-Regular.ttf" -d public/fonts/
unzip -j jetbrains-mono.zip "fonts/ttf/JetBrainsMono-Bold.ttf" -d public/fonts/

# Clean up
rm jetbrains-mono.zip 