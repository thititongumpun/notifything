"use client";

import { useState } from "react";
import {
  Button,
  Calendar,
  DateField,
  DatePicker,
  Form,
  Input,
  Label,
  Modal,
  NumberField,
  Switch,
  TextField,
  useOverlayState,
} from "@heroui/react";
import { parseDate, type CalendarDate } from "@internationalized/date";
import { Loader2, X } from "lucide-react";
import type { PaymentPlan } from "@/lib/types";

interface AddPaymentModalProps {
  plan: PaymentPlan;
  onClose: () => void;
  onSuccess: () => void;
}

function today() {
  return new Date().toISOString().split("T")[0];
}

export function AddPaymentModal({ plan, onClose, onSuccess }: AddPaymentModalProps) {
  const nextMonth =
    plan.payments.length > 0 ? Math.max(...plan.payments.map((p) => p.paymentMonth)) + 1 : 1;

  const [paymentMonth, setPaymentMonth] = useState(nextMonth);
  const [dueDate, setDueDate] = useState<CalendarDate | null>(null);
  const [amount, setAmount] = useState(Number(plan.monthlyAmount) || 0);
  const [isPaid, setIsPaid] = useState(true);
  const [paidDate, setPaidDate] = useState<CalendarDate | null>(parseDate(today()));
  const [notes, setNotes] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modalState = useOverlayState({
    isOpen: true,
    onOpenChange: (isOpen) => {
      if (!isOpen) onClose();
    },
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentPlanId: plan.id,
          dueDate: dueDate?.toString() ?? "",
          amount,
          isPaid,
          paidDate: isPaid ? paidDate?.toString() ?? "" : "",
          paymentMonth,
          notes,
          receiptNumber,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Error ${res.status}`);
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal state={modalState}>
      <Modal.Backdrop className="bg-black/70">
        <Modal.Container placement="center" size="md">
          <Modal.Dialog>
            <Modal.Header className="flex items-center justify-between border-b border-neutral-800">
              <div>
                <Modal.Heading className="text-sm font-semibold">Add Payment</Modal.Heading>
                <p className="mt-0.5 max-w-xs truncate text-xs text-neutral-400">{plan.description}</p>
              </div>
              <Modal.CloseTrigger
                aria-label="Close"
                className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Modal.CloseTrigger>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <TextField className="flex flex-col gap-1.5">
                    <Label className="text-xs font-medium text-neutral-300">
                      Payment Month <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      required
                      min={1}
                      type="number"
                      value={String(paymentMonth)}
                      onChange={(e) => setPaymentMonth(Number(e.target.value))}
                    />
                  </TextField>
                  <NumberField
                    minValue={1}
                    value={amount}
                    onChange={setAmount}
                    className="flex flex-col gap-1.5"
                  >
                    <Label className="text-xs font-medium text-neutral-300">
                      Amount (THB) <span className="text-red-400">*</span>
                    </Label>
                    <NumberField.Group>
                      <NumberField.DecrementButton />
                      <NumberField.Input />
                      <NumberField.IncrementButton />
                    </NumberField.Group>
                  </NumberField>
                </div>

                <div className="flex flex-col gap-1.5">
                  <DatePicker isRequired value={dueDate} onChange={setDueDate} name="dueDate">
                    <Label className="text-xs font-medium text-neutral-300">
                      Due Date <span className="text-red-400">*</span>
                    </Label>
                    <DateField.Group fullWidth>
                      <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
                      <DateField.Suffix>
                        <DatePicker.Trigger>
                          <DatePicker.TriggerIndicator />
                        </DatePicker.Trigger>
                      </DateField.Suffix>
                    </DateField.Group>
                    <DatePicker.Popover>
                      <Calendar aria-label="Due date">
                        <Calendar.Header>
                          <Calendar.YearPickerTrigger>
                            <Calendar.YearPickerTriggerHeading />
                            <Calendar.YearPickerTriggerIndicator />
                          </Calendar.YearPickerTrigger>
                          <Calendar.NavButton slot="previous" />
                          <Calendar.NavButton slot="next" />
                        </Calendar.Header>
                        <Calendar.Grid>
                          <Calendar.GridHeader>
                            {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                          </Calendar.GridHeader>
                          <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
                        </Calendar.Grid>
                        <Calendar.YearPickerGrid>
                          <Calendar.YearPickerGridBody>
                            {({ year }) => <Calendar.YearPickerCell year={year} />}
                          </Calendar.YearPickerGridBody>
                        </Calendar.YearPickerGrid>
                      </Calendar>
                    </DatePicker.Popover>
                  </DatePicker>
                </div>

                <Switch
                  isSelected={isPaid}
                  onChange={setIsPaid}
                  className="flex items-center justify-between rounded-lg bg-neutral-800 px-3 py-2.5"
                >
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                  <Switch.Content>
                    <Label className="text-sm text-neutral-300">Paid</Label>
                  </Switch.Content>
                </Switch>

                {isPaid ? (
                  <div className="flex flex-col gap-1.5">
                    <DatePicker value={paidDate} onChange={setPaidDate} name="paidDate">
                      <Label className="text-xs font-medium text-neutral-300">Paid Date</Label>
                      <DateField.Group fullWidth>
                        <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
                        <DateField.Suffix>
                          <DatePicker.Trigger>
                            <DatePicker.TriggerIndicator />
                          </DatePicker.Trigger>
                        </DateField.Suffix>
                      </DateField.Group>
                      <DatePicker.Popover>
                        <Calendar aria-label="Paid date">
                          <Calendar.Header>
                            <Calendar.YearPickerTrigger>
                              <Calendar.YearPickerTriggerHeading />
                              <Calendar.YearPickerTriggerIndicator />
                            </Calendar.YearPickerTrigger>
                            <Calendar.NavButton slot="previous" />
                            <Calendar.NavButton slot="next" />
                          </Calendar.Header>
                          <Calendar.Grid>
                            <Calendar.GridHeader>
                              {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                            </Calendar.GridHeader>
                            <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
                          </Calendar.Grid>
                          <Calendar.YearPickerGrid>
                            <Calendar.YearPickerGridBody>
                              {({ year }) => <Calendar.YearPickerCell year={year} />}
                            </Calendar.YearPickerGridBody>
                          </Calendar.YearPickerGrid>
                        </Calendar>
                      </DatePicker.Popover>
                    </DatePicker>
                  </div>
                ) : null}

                <div className="grid grid-cols-2 gap-3">
                  <TextField className="flex flex-col gap-1.5">
                    <Label className="text-xs font-medium text-neutral-300">Receipt No.</Label>
                    <Input
                      type="text"
                      value={receiptNumber}
                      placeholder="optional"
                      onChange={(e) => setReceiptNumber(e.target.value)}
                    />
                  </TextField>
                  <TextField className="flex flex-col gap-1.5">
                    <Label className="text-xs font-medium text-neutral-300">Notes</Label>
                    <Input
                      type="text"
                      value={notes}
                      placeholder="optional"
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </TextField>
                </div>

                {error ? (
                  <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                    {error}
                  </p>
                ) : null}

                <div className="flex items-center gap-2 pt-1">
                  <Button type="button" variant="secondary" className="flex-1" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 gap-2" isDisabled={loading}>
                    {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                    {loading ? "Saving..." : "Save Payment"}
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
