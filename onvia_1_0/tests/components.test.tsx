import { DateTimePicker } from "../src/components/forms/DateTimePicker";
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react-native";
import { Button } from "../src/components/primitives/Button";
import { Input } from "../src/components/forms/Input";
import { Checkbox } from "../src/components/forms/Checkbox";
import { Toggle } from "../src/components/forms/Toggle";
import { Select } from "../src/components/forms/Select";
import { RadioGroup } from "../src/components/forms/RadioGroup";
import { TimePicker } from "../src/components/forms/TimePicker";
import { DatePicker } from "../src/components/forms/DatePicker";
test("disabled and loading buttons block duplicate actions", () => {
  const onPress = jest.fn();
  const { rerender } = render(
    <Button label="Guardar" onPress={onPress} disabled />,
  );
  fireEvent.press(screen.getByRole("button", { name: "Guardar" }));
  expect(onPress).not.toHaveBeenCalled();
  rerender(<Button label="Guardar" onPress={onPress} loading />);
  fireEvent.press(screen.getByRole("button", { name: "Guardar" }));
  expect(onPress).not.toHaveBeenCalled();
  rerender(<Button label="Guardar" onPress={onPress} />);
  fireEvent.press(screen.getByRole("button", { name: "Guardar" }));
  expect(onPress).toHaveBeenCalledTimes(1);
});
test("input emits changes and exposes validation", () => {
  const onChangeText = jest.fn();
  render(
    <Input
      label="Nombre"
      value=""
      onChangeText={onChangeText}
      error="Completa el nombre"
    />,
  );
  fireEvent.changeText(screen.getByLabelText("Nombre"), "Ana");
  expect(onChangeText).toHaveBeenCalledWith("Ana");
  expect(screen.getByRole("alert")).toHaveTextContent("Completa el nombre");
});
test("checkbox and toggle expose state and changes", () => {
  const change = jest.fn();
  render(
    <>
      <Checkbox label="Aceptar" value={false} onChange={change} />
      <Toggle label="Permanente" value={true} onChange={change} />
    </>,
  );
  fireEvent.press(screen.getByRole("checkbox"));
  expect(change).toHaveBeenCalledWith(true);
  fireEvent(screen.getByRole("switch"), "valueChange", false);
  expect(change).toHaveBeenCalledWith(false);
});
test("select and radio group share accessible options", () => {
  const change = jest.fn();
  render(
    <>
      <Select
        label="Sexo"
        value={null}
        options={[{ value: "female", label: "Femenino" }]}
        onChange={change}
      />
      <RadioGroup
        label="Preferencia"
        value="a"
        options={[
          { value: "a", label: "A" },
          { value: "b", label: "B" },
        ]}
        onChange={change}
      />
    </>,
  );
  fireEvent.press(screen.getByRole("button"));
  fireEvent.press(screen.getByRole("radio", { name: "Femenino" }));
  expect(change).toHaveBeenCalledWith("female");
  fireEvent.press(screen.getByRole("radio", { name: "B" }));
  expect(change).toHaveBeenCalledWith("b");
});
test("time cancellation does not mutate and confirm uses canonical time", () => {
  const change = jest.fn();
  render(
    <TimePicker
      label="Horario"
      value="13:30"
      hourCycle={12}
      onChange={change}
    />,
  );
  fireEvent.press(screen.getByRole("button"));
  fireEvent.press(screen.getByRole("button", { name: "Cancelar" }));
  expect(change).not.toHaveBeenCalled();
  fireEvent.press(screen.getByRole("button"));
  fireEvent.press(screen.getByRole("button", { name: "Confirmar" }));
  expect(change).toHaveBeenCalledWith("13:30");
});
test("date cancellation preserves the original value", () => {
  const change = jest.fn();
  render(<DatePicker label="Fecha" value="2026-09-09" onChange={change} />);
  fireEvent.press(screen.getByRole("button"));
  fireEvent.press(screen.getByRole("button", { name: "Cancelar" }));
  expect(change).not.toHaveBeenCalled();
});

test("time picker enforces configured bounds", () => {
  const change = jest.fn();
  render(
    <TimePicker label="Horario" value="13:30" max="12:00" onChange={change} />,
  );
  fireEvent.press(screen.getByRole("button"));
  expect(screen.getByRole("button", { name: "Confirmar" })).toBeDisabled();
  fireEvent.press(screen.getByRole("button", { name: "Confirmar" }));
  expect(change).not.toHaveBeenCalled();
});

test("combined date-time cancels without emitting a value", () => {
  const change = jest.fn();
  render(
    <DateTimePicker
      label="Cita"
      value={{ date: "2026-09-09", time: "13:30" }}
      onChange={change}
    />,
  );
  fireEvent.press(screen.getByRole("button", { name: "Cita" }));
  fireEvent.press(screen.getByRole("button", { name: "Cancelar" }));
  expect(change).not.toHaveBeenCalled();
});
