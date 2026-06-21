"use client";

/*
  Delivers the (server-fetched) editable content to all client sections via
  context, so components call `useContent()` instead of importing static data.
  Fed once from the Server Component page; defaults act as a safe fallback.
*/

import { createContext, useContext } from "react";
import { defaultContent } from "../content-defaults";
import type { Content } from "../content-types";

const ContentContext = createContext<Content>(defaultContent);

export function ContentProvider({
  content,
  children,
}: {
  content: Content;
  children: React.ReactNode;
}) {
  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): Content {
  return useContext(ContentContext);
}
