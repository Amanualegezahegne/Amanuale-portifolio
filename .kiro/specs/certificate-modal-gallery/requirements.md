# Requirements Document

## Introduction

The Certificate Modal Gallery feature enables portfolio visitors to view, navigate, and download professional certificates through an interactive modal gallery interface. This feature integrates an existing CertificateModal component with the portfolio's About page, converting 10 PDF certificates from the "Online course certificate" folder into web-viewable images and providing an engaging user experience for showcasing professional credentials.

## Glossary

- **Certificate_Modal**: The React component that displays certificates in a modal overlay with navigation and zoom capabilities
- **About_Page**: The portfolio page (`About.jsx`) where the certificate viewing trigger button is located
- **Certificate_Button**: The user interface button that opens the Certificate Modal when clicked
- **Certificate_Image**: A web-optimized image file (JPG/PNG) converted from the original PDF certificate
- **Thumbnail_Strip**: The horizontal scrollable bar displaying miniature previews of all certificates
- **Navigation_Controls**: The previous/next arrow buttons and counter display for browsing certificates
- **Zoom_Feature**: The click-to-enlarge functionality that magnifies the currently displayed certificate
- **Download_Action**: The functionality that allows users to save individual certificate files to their device
- **Modal_State**: The open/closed state of the Certificate Modal controlled by React hooks
- **Public_Directory**: The `/public/certificates/` folder where certificate image files are stored for web access

## Requirements

### Requirement 1: Certificate File Preparation

**User Story:** As a portfolio owner, I want my PDF certificates converted to web-viewable images and organized in the correct directory, so that they can be displayed in the modal gallery.

#### Acceptance Criteria

1. THE System SHALL convert all 10 PDF files from "Online course certificate" folder to image format (JPG or PNG)
2. THE System SHALL store converted certificate images in `/public/certificates/` directory
3. THE System SHALL preserve the visual quality of certificate text and graphics during conversion
4. THE System SHALL name converted files using descriptive, URL-safe filenames
5. THE System SHALL maintain a consistent naming convention across all certificate files

### Requirement 2: Certificate Data Configuration

**User Story:** As a developer, I want to configure certificate metadata in the CertificateModal component, so that each certificate displays with correct title, issuer, and date information.

#### Acceptance Criteria

1. THE Certificate_Modal SHALL define certificate metadata in the CERTIFICATES array constant
2. FOR EACH certificate, THE System SHALL store an id, title, filename, issuer, and date
3. THE System SHALL map each filename to its corresponding image file in `/public/certificates/`
4. THE CERTIFICATES array SHALL contain exactly 10 certificate objects matching the provided PDF files
5. THE System SHALL maintain unique sequential id values for all certificate entries

### Requirement 3: View Certificates Button Integration

**User Story:** As a portfolio visitor, I want to see a "View Certificates" button next to the "Download CV" button on the About page, so that I can access the certificate gallery.

#### Acceptance Criteria

1. THE About_Page SHALL display a Certificate_Button with text "View Certificates"
2. THE Certificate_Button SHALL be positioned adjacent to the existing "Download CV" button
3. THE Certificate_Button SHALL use styling consistent with the existing button design patterns
4. THE Certificate_Button SHALL include the FaCertificate icon from react-icons
5. THE Certificate_Button SHALL be visible on desktop, tablet, and mobile screen sizes

### Requirement 4: Modal State Management

**User Story:** As a developer, I want to manage the modal's open/closed state using React hooks, so that the modal displays and hides correctly when triggered.

#### Acceptance Criteria

1. THE About_Page SHALL use useState hook to track Modal_State (isOpen boolean)
2. WHEN the Certificate_Button is clicked, THE System SHALL set Modal_State to true
3. WHEN the modal close button is clicked, THE System SHALL set Modal_State to false
4. WHEN the modal overlay is clicked, THE System SHALL set Modal_State to false
5. WHEN the Escape key is pressed, THE System SHALL set Modal_State to false

### Requirement 5: Certificate Display and Navigation

**User Story:** As a portfolio visitor, I want to navigate through multiple certificates using previous/next controls, so that I can view all certificates sequentially.

#### Acceptance Criteria

1. WHEN the Certificate_Modal is open, THE System SHALL display the current certificate image
2. THE Certificate_Modal SHALL display Navigation_Controls with previous and next arrow buttons
3. WHEN the next button is clicked, THE System SHALL display the next certificate in sequence
4. WHEN the previous button is clicked, THE System SHALL display the previous certificate in sequence
5. WHEN navigating past the last certificate, THE System SHALL wrap to the first certificate
6. WHEN navigating before the first certificate, THE System SHALL wrap to the last certificate
7. THE System SHALL display a counter showing "current / total" certificate numbers

### Requirement 6: Zoom Functionality

**User Story:** As a portfolio visitor, I want to click on a certificate to enlarge it, so that I can read fine details and text clearly.

#### Acceptance Criteria

1. WHEN a Certificate_Image is clicked, THE System SHALL toggle the Zoom_Feature state
2. WHILE Zoom_Feature is active, THE Certificate_Image SHALL scale to 1.5x magnification
3. WHILE Zoom_Feature is active, THE System SHALL display "Click image to zoom out" hint text
4. WHEN a zoomed Certificate_Image is clicked, THE System SHALL return to normal size
5. WHEN Navigation_Controls are used, THE System SHALL reset Zoom_Feature to inactive state

### Requirement 7: Thumbnail Navigation

**User Story:** As a portfolio visitor, I want to see thumbnail previews of all certificates and click them for quick access, so that I can jump directly to any certificate without sequential navigation.

#### Acceptance Criteria

1. WHERE more than 1 certificate exists, THE Certificate_Modal SHALL display a Thumbnail_Strip
2. THE Thumbnail_Strip SHALL display thumbnail images for all certificates
3. WHEN a thumbnail is clicked, THE System SHALL display the corresponding certificate
4. THE Thumbnail_Strip SHALL highlight the currently active thumbnail with accent color border
5. THE Thumbnail_Strip SHALL be horizontally scrollable when thumbnails exceed container width

### Requirement 8: Download Functionality

**User Story:** As a portfolio visitor, I want to download individual certificates, so that I can save them for verification or reference purposes.

#### Acceptance Criteria

1. THE Certificate_Modal SHALL display a download button with FaDownload icon
2. WHEN the download button is clicked, THE System SHALL initiate Download_Action
3. THE Download_Action SHALL download the currently displayed certificate file
4. THE downloaded file SHALL use the original filename from the CERTIFICATES array
5. THE System SHALL create and trigger a temporary anchor element to execute the download

### Requirement 9: Responsive Design

**User Story:** As a mobile portfolio visitor, I want the certificate modal to work properly on my device, so that I can view certificates with an optimal mobile experience.

#### Acceptance Criteria

1. WHEN viewed on screens below 768px width, THE Certificate_Modal SHALL adapt layout for mobile
2. WHEN viewed on mobile, THE Navigation_Controls and download button SHALL stack vertically
3. WHEN viewed on mobile, THE download button SHALL expand to full width
4. WHEN viewed on mobile, THE Thumbnail_Strip thumbnails SHALL reduce to 60px width
5. WHEN viewed on screens below 480px width, THE Certificate_Modal SHALL use minimal padding

### Requirement 10: Accessibility and Keyboard Support

**User Story:** As a portfolio visitor using assistive technology, I want the modal to be keyboard accessible and have proper ARIA labels, so that I can navigate the certificate gallery effectively.

#### Acceptance Criteria

1. THE Certificate_Button SHALL have an accessible label describing its purpose
2. THE close button SHALL include aria-label "Close modal"
3. THE Navigation_Controls SHALL include aria-label attributes for previous/next actions
4. THE download button SHALL include aria-label "Download certificate"
5. THE System SHALL prevent body scrolling while Modal_State is open

### Requirement 11: Error Handling

**User Story:** As a developer, I want the modal to handle missing certificate images gracefully, so that the gallery remains functional even if image files are not found.

#### Acceptance Criteria

1. WHEN a Certificate_Image fails to load, THE System SHALL display a fallback placeholder image
2. THE placeholder image SHALL indicate the missing filename for debugging purposes
3. WHEN thumbnail images fail to load, THE System SHALL display a neutral gray placeholder
4. THE System SHALL use onError event handlers to detect and handle image loading failures
5. THE Certificate_Modal SHALL remain functional and navigable when images are missing

### Requirement 12: Performance and User Experience

**User Story:** As a portfolio visitor, I want the modal to open smoothly with animations and prevent background scrolling, so that I have a polished viewing experience.

#### Acceptance Criteria

1. WHEN the Certificate_Modal opens, THE System SHALL animate with fadeIn and slideUp effects
2. WHEN Modal_State changes to open, THE System SHALL set document body overflow to hidden
3. WHEN Modal_State changes to closed, THE System SHALL restore document body overflow
4. THE System SHALL clean up event listeners when the modal closes or component unmounts
5. WHERE the user has prefers-reduced-motion enabled, THE System SHALL disable animations
