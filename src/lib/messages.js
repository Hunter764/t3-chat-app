// Chat messages are stored in the database as a JSON string of UI message parts,
// e.g. [{"type":"text","text":"hi"}]. Older rows may hold plain text instead.

export function parseStoredParts(content) {
  if (!content) return [];

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    return [{ type: "text", text: content }];
  }

  if (!Array.isArray(parsed)) {
    return [{ type: "text", text: content }];
  }

  return parsed.flatMap((part) => {
    if (part?.type === "text" && typeof part.text === "string") {
      return [{ type: "text", text: part.text }];
    }
    if (part?.type === "reasoning") {
      const text = part.text ?? part.reasoning;
      return typeof text === "string" && text ? [{ type: "reasoning", text }] : [];
    }
    return [];
  });
}

export function storedMessageToUI(msg) {
  const parts = parseStoredParts(msg.content);
  if (parts.length === 0) return null;

  return {
    id: msg.id,
    role: msg.messageRole.toLowerCase(),
    parts,
  };
}

export function textPartsOnly(uiMessage) {
  return {
    ...uiMessage,
    parts: uiMessage.parts.filter((part) => part.type === "text" && part.text.trim()),
  };
}
