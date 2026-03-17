import { IncomingMessage, ServerResponse } from "http";
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from "../store/itemStore";
import { sendSuccess, send400, send404, send405 } from "../utils/errorHandler";

function getRequestBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error("Invalid JSON"));
      }
    });
  });
}

function handleGetAll(res: ServerResponse): void {
  const items = getAllItems();
  sendSuccess(res, items);
}

function handleGetOne(res: ServerResponse, id: string): void {
  const item = getItemById(id);

  if (!item) {
    send404(res, "Item not found");
    return;
  }

  sendSuccess(res, item);
}

async function handleCreate(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const body = await getRequestBody(req);

  if (!body.name) {
    send400(res, "name is required");
    return;
  }

  const quantity = body.quantity !== undefined ? body.quantity : 1;

  const newItem = createItem(body.name, quantity, body.unit);
  sendSuccess(res, newItem, 201);
}

async function handleUpdate(
  req: IncomingMessage,
  res: ServerResponse,
  id: string
): Promise<void> {
  const item = getItemById(id);

  if (!item) {
    send404(res, "Item not found");
    return;
  }

  const body = await getRequestBody(req);

  const updatedItem = updateItem(
    id,
    body.name,
    body.quantity,
    body.unit,
    body.purchased
  );
  sendSuccess(res, updatedItem);
}

function handleDelete(res: ServerResponse, id: string): void {
  const deleted = deleteItem(id);

  if (!deleted) {
    send404(res, "Item not found");
    return;
  }

  res.writeHead(204);
  res.end();
}

export async function itemsRouter(
  req: IncomingMessage,
  res: ServerResponse,
  pathname: string
): Promise<void> {
  const method = req.method || "";

  if (pathname === "/items") {
    if (method === "GET") {
      handleGetAll(res);
    } else if (method === "POST") {
      await handleCreate(req, res);
    } else {
      send405(res);
    }
    return;
  }

  const urlParts = pathname.split("/");
  if (urlParts[1] === "items" && urlParts[2]) {
    const id = urlParts[2];

    if (method === "GET") {
      handleGetOne(res, id);
    } else if (method === "PUT") {
      await handleUpdate(req, res, id);
    } else if (method === "DELETE") {
      handleDelete(res, id);
    } else {
      send405(res);
    }
    return;
  }

  send404(res, "Route not found");
}
