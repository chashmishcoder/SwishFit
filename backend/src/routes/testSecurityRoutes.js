const express = require('express');
const router = express.Router();

/**
 * Test endpoint for NoSQL injection prevention
 * Try sending: { "email": { "$ne": null }, "password": { "$ne": null } }
 * Should be sanitized to: { "email": "", "password": "" }
 */
router.post('/test-nosql', (req, res) => {
  res.json({
    message: 'NoSQL injection test',
    receivedBody: req.body,
    explanation: 'If $ symbols are removed from keys, sanitization is working',
    expected: 'Objects like { "$ne": null } should become empty objects or strings'
  });
});

/**
 * Test endpoint for XSS prevention
 * Try sending: { "name": "<script>alert('XSS')</script>", "comment": "<img src=x onerror=alert('XSS')>" }
 * Should be sanitized to remove/escape HTML tags
 */
router.post('/test-xss', (req, res) => {
  res.json({
    message: 'XSS prevention test',
    receivedBody: req.body,
    explanation: 'If HTML tags are removed or escaped, sanitization is working',
    expected: 'Scripts and HTML should be sanitized'
  });
});

/**
 * Combined test endpoint
 */
router.post('/test-combined', (req, res) => {
  res.json({
    message: 'Combined security test',
    receivedBody: req.body,
    query: req.query,
    explanation: 'Both NoSQL injection and XSS should be prevented',
    tests: {
      nosql: 'Try: { "user": { "$ne": null } }',
      xss: 'Try: { "comment": "<script>alert(1)</script>" }'
    }
  });
});

module.exports = router;
