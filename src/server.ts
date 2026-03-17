import http, { IncomingMessage, ServerResponse } from "http";
import { itemsRouter } from "./routes/items";
import { sendJson, send404 } from "./utils/errorHandler";

const PORT = 3000;

const server = http.createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url || "/";
    const pathname = url.split("?")[0];

    try {
      if (pathname === "/") {
        sendJson(res, 200, { message: "Welcome to the Shopping List API" });
        return;
      }

      if (pathname.startsWith("/items")) {
        await itemsRouter(req, res, pathname);
        return;
      }

      send404(res, "Route not found");
    } catch (error) {
      console.error(error);
      sendJson(res, 500, { success: false, error: "Something went wrong" });
    }
  }
);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
