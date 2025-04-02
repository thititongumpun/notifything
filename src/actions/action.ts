'use server'

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Schedule must be at least 2 characters.",
  }),
  cron: z.string().min(5, {
    message: "Cron expression must be at least 5 characters.",
  }),
});

// Define the return type for better type safety
type ActionResult = {
  success: boolean;
  error?: string;
};

export async function create(data: z.infer<typeof formSchema>): Promise<ActionResult> {
  try {
    // Validate the data on the server side
    const validatedData = formSchema.parse(data);

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/addjob`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });

    // Revalidate the path after creating the schedule
    revalidatePath('/'); // Adjust the path as needed

    return { success: true };
  } catch (error) {
    console.error('Error creating schedule:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation failed: ' + error.errors.map(e => e.message).join(', ')
      };
    }

    return {
      success: false,
      error: 'Failed to create schedule. Please try again later.'
    };
  }
}

const updateFormSchema = z.object({
  name: z.string().min(2, {
    message: "Schedule must be at least 2 characters.",
  }),
  cron: z.string().min(5, {
    message: "Cron expression must be at least 5 characters.",
  }),
  enabled: z.boolean(),
});

export async function update(id: string, data: z.infer<typeof updateFormSchema>): Promise<ActionResult> {
  try {
    // Validate the data on the server side
    const validatedData = updateFormSchema.parse(data);
    // Toggle the enabled field
    validatedData.enabled = !validatedData.enabled;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });

    // Revalidate the path after updating the schedule
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error updating schedule:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation failed: ' + error.errors.map(e => e.message).join(', ')
      };
    }

    return {
      success: false,
      error: 'Failed to update schedule. Please try again later.'
    };
  }
}

export async function remove(id: string): Promise<ActionResult> {
  try {

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`, {
      method: 'DELETE'
    });

    revalidatePath('/');

    return { success: true };

    return { success: true };
  } catch (error) {
    console.error('Error updating schedule:', error);
    return {
      success: false,
      error: 'Failed to update schedule. Please try again later.'
    };
  }
}