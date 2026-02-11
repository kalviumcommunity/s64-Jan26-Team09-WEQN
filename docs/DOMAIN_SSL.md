# Assignment 2.42: Domain & SSL Configuration Guide

This document outlines the procedure for configuring a custom domain and SSL/TLS certificate for the Digital Queue Management System in a cloud environment (AWS/Azure).

## 1. DNS Configuration (Route 53 / Azure DNS)
To point your custom domain (e.g., `api.weqn-hospital.com`) to the application:

### AWS (Route 53)
1. **Create Hosted Zone**: Create a public hosted zone for your domain.
2. **Create Alias Record**: 
   - Choose the Record Type: `A - Routes traffic to an IPv4 address and some AWS resources`.
   - Enable "Alias".
   - Select "Alias to Application Load Balancer".
   - Choose the region and the specific ALB where the ECS service is running.

### Azure (Azure DNS)
1. **DNS Zone**: Create a DNS zone for your domain.
2. **CNAME/Alias Record**: Create a CNAME record pointing to the Azure App Service default hostname (e.g., `weqn.azurewebsites.net`) or an Alias record pointing to the Azure Front Door/Load Balancer.

## 2. SSL/TLS Certificate (ACM / Azure App Service Certificate)
Managed certificates are recommended for automatic renewal and security.

### AWS (ACM - Amazon Certificate Manager)
1. **Request Certificate**: Request a public SSL/TLS certificate for your domain.
2. **Validation**: Use DNS validation (add the provided CNAME record to Route 53).
3. **Status**: Wait for the status to change to "Issued".

### Azure
1. **App Service Managed Certificate**: Request a free managed certificate directly within the App Service TLS/SSL settings.
2. **Validation**: Azure validates domain ownership automatically via DNS.

## 3. SSL Termination at Load Balancer
In modern cloud architectures, SSL termination occurs at the **Load Balancer (ALB / Front Door)** rather than the application server.

### Why SSL Termination?
- **Performance**: Offloads the intensive CPU work of decryption from the application containers (ECS/App Service).
- **Simplicity**: Certificates are managed in one central place (the LB) instead of multiple app instances.
- **Security**: Allows the Load Balancer to perform inspection and WAF (Web Application Firewall) filtering before traffic reaches the app.

### Application Protocol Enforcement
The application detects the original protocol via the `x-forwarded-proto` header. If the Load Balancer receives an HTTP request, the application middleware automatically redirects it to HTTPS.

## 4. Application Configuration
Ensure the following environment variables are set in production:
- `NEXT_PUBLIC_APP_URL`: Your full domain (e.g., `https://api.weqn-hospital.com`).
- `NODE_ENV`: Must be set to `production` to enable HSTS and secure cookie flags.

## 5. Security Headers
The application enforces the following headers via `next.config.js`:
- **HSTS**: `Strict-Transport-Security` forces browsers to use HTTPS for all future requests.
- **CSP**: `Content-Security-Policy` prevents XSS and unauthorized resource loading.
- **Cookie Security**: Authentication cookies are automatically configured with `Secure`, `HttpOnly`, and `SameSite=Strict` flags in production.
