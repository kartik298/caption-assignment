Video Caption Editor
A React-based web application that allows users to add captions to videos from any source.
Features

Universal Video Support: Works with YouTube, Vimeo, Dailymotion, Facebook, Twitch, and direct video files
Easy Caption Creation: Add text captions with precise start and end timestamps
Real-time Preview: See captions appear during video playback exactly as they will for viewers
Time Capture: "Set Current" buttons to easily capture the exact current playback time
Caption Management: Edit, delete, and reorder captions as needed
Export Functionality: Download captions as standard WebVTT files
Responsive Design: Works on desktop and mobile devices

How to Use

Enter Video URL: Paste any video URL (YouTube, direct video link, etc.)
Load Video: Click the "Load Video" button to load the video player
Add Captions:

Enter caption text
Set start and end times (manually or using "Set Current" while playing)
Click "Add Caption" to save


Edit Captions: Use the edit and delete buttons to modify existing captions
Export: Download your completed captions as a WebVTT file

Technical Details

Built with React (hooks-based architecture)
No external dependencies or CSS frameworks
Uses inline styles for maximum compatibility
Implements responsive design with custom media queries
Automatically detects video platform from URL

Getting Started
bashCopy# Clone the repository
git clone https://github.com/kartik298/caption-assignment.git

# Navigate to the project directory
cd caption-assignment

# Install dependencies
npm install

# Start the development server
npm start
License
MIT
Acknowledgements
Created as part of a project to improve video accessibility.
