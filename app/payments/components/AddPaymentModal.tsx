/* Hallmark · genre: modern-minimal · macrostructure: Workbench · design-system: design.md · designed-as-app */
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

const inputClass =
  "rounded-[var(--radius-input)] border border-[var(--color-rule)] bg-[var(--color-paper-3)] text-[var(--color-ink)] transition-colors duration-[180ms] [transition-timing-function:var(--ease-out)]";

const labelClass = "text-sm text-[var(--color-ink-2)]";

function RequiredMark() {
  return (
    <span className="text-[var(--color-danger)]" aria-hidden>
      *
    </span>
  );
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
          <Modal.Dialog className="rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
            <Modal.Header className="flex items-center justify-between border-b border-[var(--color-rule)]">
              <div className="min-w-0">
                <Modal.Heading
                  className="font-semibold text-[var(--color-ink)]"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-md)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Add Payment
                </Modal.Heading>
                <p
                  className="mt-[var(--space-3xs)] max-w-xs truncate text-xs text-[var(--color-ink-2)]"
                  style={{ overflowWrap: "anywhere" }}
                >
                  {plan.description}
                </p>
              </div>
              <Modal.CloseTrigger
                aria-label="Close"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[10px] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-[var(--space-3xs)] text-[var(--color-ink-2)] transition-colors duration-[180ms] [transition-timing-function:var(--ease-out)] hover:bg-[var(--color-paper-3)] hover:text-[var(--color-ink)] active:translate-y-px"
              >
                <X className="h-4 w-4" aria-hidden />
              </Modal.CloseTrigger>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit} className="flex flex-col gap-[var(--space-2xs)]">
                <div className="grid grid-cols-2 gap-[var(--space-2xs)]">
                  <TextField className="flex flex-col gap-[var(--space-3xs)]">
                    <Label className={labelClass}>
                      Payment Month <RequiredMark />
                    </Label>
                    <Input
                      required
                      min={1}
                      type="number"
                      value={String(paymentMonth)}
                      onChange={(e) => setPaymentMonth(Number(e.target.value))}
                      className={inputClass}
                    />
                  </TextField>
                  <NumberField
                    minValue={1}
                    value={amount}
                    onChange={setAmount}
                    className="flex flex-col gap-[var(--space-3xs)]"
                  >
                    <Label className={labelClass}>
                      Amount (THB) <RequiredMark />
                    </Label>
                    <NumberField.Group className={inputClass}>
                      <NumberField.DecrementButton />
                      <NumberField.Input />
                      <NumberField.IncrementButton />
                    </NumberField.Group>
                  </NumberField>
                </div>

                <div className="flex flex-col gap-[var(--space-3xs)]">
                  <DatePicker isRequired value={dueDate} onChange={setDueDate} name="dueDate">
                    <Label className={labelClass}>
                      Due Date <RequiredMark />
                    </Label>
                    <DateField.Group fullWidth className={inputClass}>
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
                  className="flex min-h-[44px] items-center justify-between rounded-[var(--radius-input)] border border-[var(--color-rule)] bg-[var(--color-paper-3)] px-[var(--space-2xs)] py-[var(--space-2xs)]"
                >
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                  <Switch.Content>
                    <Label className="text-sm text-[var(--color-ink)]">Paid</Label>
                  </Switch.Content>
                </Switch>

                {isPaid ? (
                  <div className="flex flex-col gap-[var(--space-3xs)]">
                    <DatePicker value={paidDate} onChange={setPaidDate} name="paidDate">
                      <Label className={labelClass}>Paid Date</Label>
                      <DateField.Group fullWidth className={inputClass}>
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

                <div className="grid grid-cols-2 gap-[var(--space-2xs)]">
                  <TextField className="flex flex-col gap-[var(--space-3xs)]">
                    <Label className={labelClass}>Receipt No.</Label>
                    <Input
                      type="text"
                      value={receiptNumber}
                      placeholder="optional"
                      onChange={(e) => setReceiptNumber(e.target.value)}
                      className={inputClass}
                    />
                  </TextField>
                  <TextField className="flex flex-col gap-[var(--space-3xs)]">
                    <Label className={labelClass}>Notes</Label>
                    <Input
                      type="text"
                      value={notes}
                      placeholder="optional"
                      onChange={(e) => setNotes(e.target.value)}
                      className={inputClass}
                    />
                  </TextField>
                </div>

                {error ? (
                  <p
                    className="rounded-[var(--radius-input)] border px-[var(--space-2xs)] py-[var(--space-2xs)] text-xs"
                    style={{
                      borderColor: "color-mix(in oklab, var(--color-danger) 30%, transparent)",
                      backgroundColor: "color-mix(in oklab, var(--color-danger) 10%, transparent)",
                      color: "var(--color-danger)",
                    }}
                  >
                    {error}
                  </p>
                ) : null}

                <div className="flex items-center gap-[var(--space-2xs)] pt-[var(--space-3xs)]">
                  <Button
                    type="button"
                    variant="secondary"
                    className="min-h-[44px] flex-1 rounded-[10px] border border-[var(--color-rule)] bg-[var(--color-paper-2)] text-[var(--color-ink)] transition-[transform,background-color] duration-[180ms] [transition-timing-function:var(--ease-out)] hover:bg-[var(--color-paper-3)] active:translate-y-px"
                    onPress={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="min-h-[44px] flex-1 gap-2 rounded-[10px] bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-medium transition-[transform,background-color] duration-[180ms] [transition-timing-function:var(--ease-out)] hover:bg-[var(--color-focus)] active:translate-y-px"
                    isDisabled={loading}
                  >
                    {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : null}
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
