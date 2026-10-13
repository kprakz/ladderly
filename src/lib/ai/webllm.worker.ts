// Runs the in-browser model (WebLLM) on a background thread, so writing a path never freezes the page.
// The page talks to it through `CreateWebWorkerMLCEngine` in browserEngine.ts.
import { WebWorkerMLCEngineHandler } from "@mlc-ai/web-llm";

const handler = new WebWorkerMLCEngineHandler();
self.onmessage = (message: MessageEvent) => handler.onmessage(message);
