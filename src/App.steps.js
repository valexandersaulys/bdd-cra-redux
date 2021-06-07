import { defineFeature, loadFeature } from "jest-cucumber";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitForElement
} from "@testing-library/react";

import counterReducer from "./features/counter/counterSlice";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";

const feature = loadFeature("src/App.feature");

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

defineFeature(feature, (test) => {
  afterEach(async () => {
    await counterReducer({ value: 0, status: "idle" }, { type: "unknown" });
  });

  test("page loads spinner", ({ given, when, then }) => {
    given("my browser is open", async () => {
      render(
        <Provider store={store}>
          <App />
        </Provider>
      );
    });

    when("my page loads", async () => {
      await waitForElement(() => screen.getByRole("banner"));
    });

    then("I should see a spinner", async () => {
      expect(document.querySelector(".App-logo").src).toContain("logo.svg");
    });
  });

  test("counter works", ({ given, when, then }) => {
    let vals = {};
    given("the app is loaded with the counter", async () => {
      render(
        <Provider store={store}>
          <App />
        </Provider>
      );
      await waitForElement(() => screen.getByRole("banner"));
      vals.currentValue = Number(document.querySelector(".value").textContent);
    });

    when("the plus button is pressed", async () => {
      const incrementButton = document.querySelector(
        '[aria-label="Increment value"]'
      );
      fireEvent.click(incrementButton);
    });

    then("I should see an increment", async () => {
      const newValue = Number(document.querySelector(".value").textContent);
      expect(newValue).toBe(vals.currentValue + 1);
    });
  });

  test("counter works by adding arbitrary value", ({ given, when, then }) => {
    let vals = {};
    given("the app is loaded with the counter", async () => {
      render(
        <Provider store={store}>
          <App />
        </Provider>
      );
      await waitForElement(() => screen.getByRole("banner"));
      vals.currentValue = Number(document.querySelector(".value").textContent);
    });

    when(/^an amount is added to the counter and I press "(.*)"$/, (arg0) => {
      const inputField = document.querySelector(
        '[aria-label="Set increment amount"]'
      );
      expect(inputField).not.toBeNull();
      // https://testing-library.com/docs/dom-testing-library/api-events/#fireeventeventname
      fireEvent.change(inputField, { target: { value: "125" } });
      const addBtn = screen.getByText(arg0);
      fireEvent.click(addBtn);
    });

    then("I should see the corresponding amount added", () => {
      const newValue = Number(document.querySelector(".value").textContent);
      expect(newValue).toBe(vals.currentValue + 125);
    });
  });

  test("counter works by adding async value", ({ given, when, then }) => {
    let vals = {};

    given("the app is loaded with the counter", async () => {
      render(
        <Provider store={store}>
          <App />
        </Provider>
      );
      await waitForElement(() => screen.getByRole("banner"));
      vals.currentValue = Number(document.querySelector(".value").textContent);
    });

    when(
      /^an async amount is added to the counter and I press "(.*)"$/,
      async (arg0) => {
        const inputField = document.querySelector(
          '[aria-label="Set increment amount"]'
        );
        expect(inputField).not.toBeNull();
        fireEvent.change(inputField, { target: { value: "321" } });
        const addBtn = screen.getByText(arg0);
        fireEvent.click(addBtn);
        await delay(500);
      }
    );

    then("I should see the corresponding amount added post-async", () => {
      const newValue = Number(document.querySelector(".value").textContent);
      expect(newValue).toBe(vals.currentValue + 321);
    });
  });
});
