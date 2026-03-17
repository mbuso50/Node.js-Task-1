import { ServerResponse } from "http";

export function sendJson(
  res: ServerResponse,
  statusCode: number,
  data: object
): void {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(body);
}

export function sendSuccess(
  res: ServerResponse,
  data: any,
  statusCode: number = 200
): void {
  sendJson(res, statusCode, { success: true, data: data });
}

export function send400(res: ServerResponse, message: string): void {
  sendJson(res, 400, { success: false, error: message });
}

export function send404(res: ServerResponse, message: string): void {
  sendJson(res, 404, { success: false, error: message });
}

export function send405(res: ServerResponse): void {
  sendJson(res, 405, { success: false, error: "Method not allowed" });
}
