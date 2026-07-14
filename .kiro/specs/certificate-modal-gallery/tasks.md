# Tasks

## Task 1: Convert PDF certificates to web images
**Requirements:** Req 1
**Description:** Convert all 10 PDF certificate files from "Online course certificate" folder to JPG/PNG format and organize them in `/public/certificates/` directory with descriptive filenames.

**Subtasks:**
- [x] Create `/public/certificates/` directory if it doesn't exist
- [x] Convert "aman udacity.pdf" to "udacity-react-1.jpg"
- [x] Convert "aman udacity 2.pdf" to "udacity-react-2.jpg"
- [x] Convert "amann dbu course1.pdf" to "dbu-course-1.jpg"
- [x] Convert "amann dbu course 2.pdf" to "dbu-course-2.jpg"
- [x] Convert "amann dbu course 3.pdf" to "dbu-course-3.jpg"
- [x] Convert "amann dbu course 4.pdf" to "dbu-course-4.jpg"
- [x] Convert "amann dbu course 5.pdf" to "dbu-course-5.jpg"
- [x] Convert "amann dbu course 6.pdf" to "dbu-course-6.jpg"
- [x] Convert "amann dbu course 7.pdf" to "dbu-course-7.jpg"
- [x] Convert "Amanuale_Gezahegn_Certificate.pdf" to "dbu-certificate-main.jpg"
- [x] Verify all images maintain good quality and readability

**Acceptance Test:**
```javascript
// Verify all 10 certificate images exist in public/certificates/
const expectedFiles = [
  'udacity-react-1.jpg',
  'udacity-react-2.jpg',
  'dbu-course-1.jpg',
  'dbu-course-2.jpg',
  'dbu-course-3.jpg',
  'dbu-course-4.jpg',
  'dbu-course-5.jpg',
  'dbu-course-6.jpg',
  'dbu-course-7.jpg',
  'dbu-certificate-main.jpg'
];
// All files should be accessible via /certificates/ path
```

---

## Task 2: Update CertificateModal with real certificate data
**Requirements:** Req 2
**Dependencies:** Task 1
**Description:** Update the CERTIFICATES array in CertificateModal.jsx with metadata for all 10 certificates matching the converted image files.

**Subtasks:**
- [x] Open `src/Components/CertificateModal.jsx`
- [~] Replace placeholder CERTIFICATES array with real data
- [~] Add certificate entry for "Udacity React Nanodegree - Part 1" (udacity-react-1.jpg)
- [~] Add certificate entry for "Udacity React Nanodegree - Part 2" (udacity-react-2.jpg)
- [~] Add certificate entries for all 7 DBU course certificates (dbu-course-1 through dbu-course-7)
- [~] Add certificate entry for main DBU certificate (dbu-certificate-main.jpg)
- [~] Verify each entry has unique id, title, filename, issuer, and date
- [~] Ensure filenames match exactly with files in `/public/certificates/`

**Acceptance Test:**
```javascript
import CertificateModal from './CertificateModal';
// CERTIFICATES array should have exactly 10 entries
// Each entry should have: id, title, filename, issuer, date
// All filenames should match files in /public/certificates/
// IDs should be unique and sequential (1-10)
```

---

## Task 3: Add View Certificates button to About page
**Requirements:** Req 3
**Description:** Add a "View Certificates" button next to the "Download CV" button on the About page with FaCertificate icon.

**Subtasks:**
- [~] Open `src/Pages/About.jsx`
- [~] Import FaCertificate from 'react-icons/fa'
- [~] Add useState import if not present
- [~] Create isModalOpen state variable (useState<boolean>(false))
- [~] Locate the "Download CV" button in the JSX
- [~] Add "View Certificates" button immediately after the Download CV button
- [~] Apply `btn btn-secondary` classes for consistent styling
- [~] Add FaCertificate icon to the button
- [~] Add onClick handler to set isModalOpen to true
- [~] Add aria-label="View my certificates" to button

**Acceptance Test:**
```javascript
import { render, screen } from '@testing-library/react';
import About from './About';

it('should render View Certificates button', () => {
  render(<About />);
  const button = screen.getByText(/View Certificates/i);
  expect(button).toBeInTheDocument();
  expect(button).toHaveClass('btn', 'btn-secondary');
});
```

---

## Task 4: Integrate CertificateModal with About page state
**Requirements:** Req 4
**Dependencies:** Task 3
**Description:** Connect the CertificateModal component to About page state management, enabling modal open/close functionality.

**Subtasks:**
- [~] Import CertificateModal component in About.jsx (already imported, verify it's there)
- [~] Create handleCloseModal function that sets isModalOpen to false
- [~] Add CertificateModal component to JSX at the end of the About component
- [~] Pass isOpen={isModalOpen} prop to CertificateModal
- [~] Pass onClose={handleCloseModal} prop to CertificateModal
- [~] Verify CertificateModal's existing close mechanisms work (close button, overlay click, ESC key)

**Acceptance Test:**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import About from './About';

it('should open modal when View Certificates is clicked', () => {
  render(<About />);
  const button = screen.getByText(/View Certificates/i);
  fireEvent.click(button);
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});

it('should close modal when close button is clicked', () => {
  render(<About />);
  const viewButton = screen.getByText(/View Certificates/i);
  fireEvent.click(viewButton);
  const closeButton = screen.getByLabelText('Close modal');
  fireEvent.click(closeButton);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
```

---

## Task 5: Verify navigation and zoom functionality
**Requirements:** Req 5, Req 6
**Dependencies:** Task 2, Task 4
**Description:** Test and verify that certificate navigation (prev/next/thumbnails) and zoom functionality work correctly with the real certificate data.

**Subtasks:**
- [~] Open the application in browser
- [~] Click "View Certificates" button to open modal
- [~] Verify first certificate displays (1/10 counter)
- [~] Click next button 9 times, verify counter reaches 10/10
- [~] Click next again, verify it wraps to 1/10
- [~] Click previous from 1/10, verify it wraps to 10/10
- [~] Click on certificate image, verify zoom activates (1.5x scale)
- [~] Verify "Click image to zoom out" hint appears
- [~] Click zoomed image, verify it returns to normal size
- [~] Click next while zoomed, verify zoom resets
- [~] Click on thumbnail, verify it jumps to that certificate
- [~] Verify active thumbnail has accent border

**Acceptance Test:**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import CertificateModal from './CertificateModal';

it('should wrap to first certificate when next is clicked on last', () => {
  const onClose = vi.fn();
  render(<CertificateModal isOpen={true} onClose={onClose} />);
  const nextBtn = screen.getByLabelText('Next certificate');
  // Click next 10 times to wrap around
  for (let i = 0; i < 10; i++) {
    fireEvent.click(nextBtn);
  }
  expect(screen.getByText('1 / 10')).toBeInTheDocument();
});

it('should toggle zoom on image click', () => {
  const onClose = vi.fn();
  render(<CertificateModal isOpen={true} onClose={onClose} />);
  const img = screen.getByAlt(/certificate/i);
  fireEvent.click(img);
  expect(img).toHaveClass('zoomed');
  fireEvent.click(img);
  expect(img).not.toHaveClass('zoomed');
});
```

---

## Task 6: Verify download functionality
**Requirements:** Req 8
**Dependencies:** Task 2, Task 4
**Description:** Test that the download button correctly downloads individual certificate files.

**Subtasks:**
- [ ] Open the application in browser
- [~] Click "View Certificates" to open modal
- [~] Click download button on first certificate
- [~] Verify file download initiates
- [~] Check downloaded filename matches expected (udacity-react-1.jpg)
- [~] Navigate to different certificate (e.g., certificate 5)
- [~] Click download button
- [~] Verify correct file downloads (dbu-course-3.jpg for certificate 5)
- [~] Test download on mobile browser (if available)

**Acceptance Test:**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import CertificateModal from './CertificateModal';

it('should trigger download when download button is clicked', () => {
  const onClose = vi.fn();
  const createElementSpy = vi.spyOn(document, 'createElement');
  render(<CertificateModal isOpen={true} onClose={onClose} />);
  const downloadBtn = screen.getByLabelText('Download certificate');
  fireEvent.click(downloadBtn);
  expect(createElementSpy).toHaveBeenCalledWith('a');
});
```

---

## Task 7: Test responsive design on mobile devices
**Requirements:** Req 9
**Dependencies:** Task 4
**Description:** Verify the modal adapts correctly for mobile viewports (< 768px and < 480px).

**Subtasks:**
- [~] Open browser DevTools responsive mode
- [~] Set viewport to 767px width
- [~] Open certificate modal
- [~] Verify navigation controls and download button stack vertically
- [~] Verify download button expands to full width
- [~] Verify thumbnail sizes reduce to 60px
- [~] Set viewport to 479px width
- [~] Verify modal uses minimal padding
- [~] Verify all content is readable and accessible
- [~] Test on actual mobile device (iOS/Android if available)
- [~] Verify touch events work for image zoom, navigation, thumbnails

**Acceptance Test:**
```javascript
import { render, screen } from '@testing-library/react';
import CertificateModal from './CertificateModal';

it('should apply mobile styles at 767px viewport', () => {
  global.innerWidth = 767;
  global.dispatchEvent(new Event('resize'));
  const onClose = vi.fn();
  const { container } = render(<CertificateModal isOpen={true} onClose={onClose} />);
  // Verify CSS classes or computed styles for mobile layout
  const downloadBtn = screen.getByLabelText('Download certificate');
  expect(downloadBtn).toBeVisible();
});
```

---

## Task 8: Verify accessibility and keyboard support
**Requirements:** Req 10
**Dependencies:** Task 4
**Description:** Test that the modal meets accessibility standards with proper ARIA labels, keyboard navigation, and screen reader support.

**Subtasks:**
- [~] Open modal and verify View Certificates button has accessible label
- [~] Verify close button has aria-label="Close modal"
- [~] Verify previous button has aria-label="Previous certificate"
- [~] Verify next button has aria-label="Next certificate"
- [~] Verify download button has aria-label="Download certificate"
- [~] Open modal and press Tab key to verify focus moves through interactive elements
- [~] Press Escape key and verify modal closes
- [~] Verify body scroll is locked when modal is open
- [~] Close modal and verify body scroll is restored
- [~] Test with screen reader (NVDA/JAWS/VoiceOver if available)

**Acceptance Test:**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import About from './About';

it('should have proper aria-labels on all buttons', () => {
  render(<About />);
  fireEvent.click(screen.getByText(/View Certificates/i));
  expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
  expect(screen.getByLabelText('Previous certificate')).toBeInTheDocument();
  expect(screen.getByLabelText('Next certificate')).toBeInTheDocument();
  expect(screen.getByLabelText('Download certificate')).toBeInTheDocument();
});

it('should close modal on Escape key', () => {
  render(<About />);
  fireEvent.click(screen.getByText(/View Certificates/i));
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

it('should lock body scroll when modal is open', () => {
  render(<About />);
  fireEvent.click(screen.getByText(/View Certificates/i));
  expect(document.body.style.overflow).toBe('hidden');
});
```

---

## Task 9: Test error handling for missing images
**Requirements:** Req 11
**Dependencies:** Task 4
**Description:** Verify the modal handles missing certificate images gracefully with placeholder fallbacks.

**Subtasks:**
- [~] Temporarily rename one certificate image file in `/public/certificates/`
- [~] Open modal and navigate to the certificate with missing image
- [~] Verify placeholder SVG displays with "Certificate Image Not Found" message
- [~] Verify filename is shown in placeholder for debugging
- [~] Verify modal remains functional (navigation, zoom, download still work)
- [~] Check thumbnail for missing image shows gray placeholder
- [~] Restore renamed image file
- [~] Test with all images present to verify normal operation

**Acceptance Test:**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import CertificateModal from './CertificateModal';

it('should display placeholder when certificate image fails to load', () => {
  const onClose = vi.fn();
  render(<CertificateModal isOpen={true} onClose={onClose} />);
  const img = screen.getByAlt(/certificate/i);
  fireEvent.error(img);
  expect(img.src).toContain('data:image/svg+xml');
  expect(img.src).toContain('Certificate Image Not Found');
});

it('should display placeholder for thumbnail on error', () => {
  const onClose = vi.fn();
  render(<CertificateModal isOpen={true} onClose={onClose} />);
  const thumbnails = screen.getAllByRole('button', { name: /View/i });
  const thumbImg = thumbnails[0].querySelector('img');
  fireEvent.error(thumbImg);
  expect(thumbImg.src).toContain('data:image/svg+xml');
});
```

---

## Task 10: Verify animations and user experience polish
**Requirements:** Req 12
**Dependencies:** Task 4
**Description:** Test that modal animations work smoothly and respect user preferences for reduced motion.

**Subtasks:**
- [~] Open modal and observe fadeIn/slideUp animations
- [~] Verify animations are smooth (no jank or flicker)
- [~] Verify thumbnail strip scrolls smoothly when navigating
- [~] Test with browser DevTools > Rendering > "Emulate CSS prefers-reduced-motion"
- [~] Enable prefers-reduced-motion
- [~] Open modal and verify animations are disabled
- [~] Verify modal still functions correctly without animations
- [~] Close and reopen modal multiple times to test for memory leaks
- [~] Use browser DevTools Performance tab to check for performance issues
- [~] Verify event listeners are cleaned up when modal closes (check in DevTools)

**Acceptance Test:**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import About from './About';

it('should clean up event listeners on modal close', () => {
  const { unmount } = render(<About />);
  fireEvent.click(screen.getByText(/View Certificates/i));
  const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
  const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
  
  fireEvent.click(screen.getByLabelText('Close modal'));
  expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  
  unmount();
});

it('should restore body overflow when component unmounts', () => {
  const { unmount } = render(<About />);
  fireEvent.click(screen.getByText(/View Certificates/i));
  expect(document.body.style.overflow).toBe('hidden');
  unmount();
  expect(document.body.style.overflow).toBe('unset');
});
```

---

## Task 11: Cross-browser and final integration testing
**Requirements:** All
**Dependencies:** All previous tasks
**Description:** Perform comprehensive cross-browser testing and final integration verification before deployment.

**Subtasks:**
- [~] Test in Chrome/Edge (desktop)
- [~] Test in Firefox (desktop)
- [~] Test in Safari (desktop, if available)
- [~] Test in Chrome Mobile (Android, if available)
- [~] Test in Safari Mobile (iOS, if available)
- [~] Verify all 10 certificates display correctly in each browser
- [~] Verify navigation works in all browsers
- [~] Verify download works in all browsers
- [~] Verify zoom works in all browsers
- [~] Verify responsive design works on actual devices
- [~] Test network throttling (slow 3G) to verify image loading
- [~] Verify no console errors or warnings
- [~] Run lighthouse audit for accessibility score
- [~] Take screenshots for documentation

**Acceptance Test:**
Manual testing checklist completion and lighthouse audit passing with:
- Accessibility score >= 90
- Best Practices score >= 90
- No critical console errors
