"use client";
import * as React from "react";
import { makePage } from "@keystatic/next/ui/app";
import config from "../../keystatic.config";
import { KeystaticFooter } from "./KeystaticFooter";

const KeystaticPage = makePage(config);

export default function KeystaticDashboard() {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(KeystaticPage),
    React.createElement(KeystaticFooter)
  );
}
