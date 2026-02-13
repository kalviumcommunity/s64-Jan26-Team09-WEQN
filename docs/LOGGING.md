# Assignment 2.43: Logging & Monitoring Guide

This document explains the structured logging implementation and monitoring strategy for the Digital Queue Management System.

## 1. Structured Logging Implementation

The application uses a custom structured logging utility located in `src/lib/logger.ts`.

### Log Format
In production, logs are emitted as single-line JSON objects to `stdout` and `stderr`. This format is natively supported by cloud logging services like **Amazon CloudWatch** and **Azure Monitor**.

```json
{
  "level": "info",
  "message": "Login successful",
  "timestamp": "2026-02-13T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user_123",
  "role": "DOCTOR"
}
```

### Log Levels
- **info**: General operational logs (e.g., successful login, queue updates).
- **warn**: Recoverable issues or suspicious activity (e.g., failed login attempts, slow queries).
- **error**: Critical failures, unhandled exceptions, or database connection issues.
- **debug**: Detailed execution logs (enabled in development only).

## 2. Cloud Log Flow

### AWS (ECS + CloudWatch)
1. The application container writes logs to `stdout`/`stderr`.
2. The ECS task is configured with the `awslogs` log driver.
3. The Docker engine sends logs to a CloudWatch Log Group.
4. Logs can be queried using **CloudWatch Logs Insights**.

### Azure (App Service + Azure Monitor)
1. Application logs are captured from `stdout`/`stderr`.
2. Logs are streamed to **Azure Log Analytics**.
3. Use **Kusto Query Language (KQL)** to analyze logs and create dashboards.

## 3. Key Metrics to Monitor

| Metric | Threshold | Log Query Filter |
| :--- | :--- | :--- |
| **Error Rate** | > 1% of total requests | `level == "error"` |
| **Auth Failures** | > 10 in 5 minutes | `message == "Login failed*"` |
| **P95 Response Time** | > 500ms | `duration > 500` (from Prisma/Middleware) |
| **API Traffic** | Spikes > 2x normal | `level == "info" && message == "Incoming*"` |

## 4. Setting Up Alerts

### CloudWatch Alarms
1. Create a **Metric Filter** in the CloudWatch Log Group (e.g., filter for `"level":"error"`).
2. Create a CloudWatch Alarm based on the custom metric.
3. Configure **SNS** to send notifications (Email/Slack/PagerDuty).

### Azure Monitor Alerts
1. Create a **Log Alert Rule**.
2. Define the signal logic using a KQL query.
3. Set the threshold and evaluation frequency.
4. Assign an **Action Group** for notifications.

## 5. Best Practices
- **No PII**: Never log passwords, JWT secrets, or full request bodies.
- **Correlation**: Always include `requestId` to trace a single request across multiple log entries.
- **Structured Data**: Prefer adding context as separate JSON keys rather than concatenating strings in the message.
