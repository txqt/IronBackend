# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of IronBackend seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please send an email to: **cv.hovanthanh@gmail.com** (or create a private security advisory on GitHub)

Include the following information in your report:
- Type of vulnerability (e.g., code injection, data exposure, etc.)
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue and how an attacker might exploit it

### What to Expect

- **Initial Response**: We will acknowledge receipt of your report within 48 hours
- **Status Updates**: We will provide updates on the progress every 5 business days
- **Resolution Timeline**: We aim to resolve critical vulnerabilities within 14 days

### Safe Harbor

We consider security research conducted in good faith to be authorized and will not pursue legal action against researchers who:
- Make a good faith effort to avoid privacy violations, destruction of data, and interruption of services
- Only interact with accounts you own or have explicit permission to test
- Do not exploit a security issue for purposes other than demonstrating the vulnerability
- Report vulnerabilities promptly and do not publicly disclose the issue before it is resolved

## Security Considerations

### What IronBackend Does

IronBackend is a **read-only knowledge base** that provides:
- Architecture style definitions
- Design rules and best practices
- Security playbooks (as documentation)

### What IronBackend Does NOT Do

- **No runtime code execution**: IronBackend generates static prompts, it does not execute code
- **No network requests**: The CLI operates entirely locally
- **No data collection**: No telemetry, analytics, or user data collection
- **No credentials storage**: IronBackend does not store or manage secrets

### Low-Risk Profile

As a documentation/prompt generation tool, IronBackend has a relatively low security risk profile. The primary concerns would be:
- Supply chain attacks via npm dependencies
- Malicious prompt injection in generated content

We regularly audit dependencies and follow npm security best practices.

## Acknowledgments

We thank all security researchers who help keep IronBackend and its users safe.
