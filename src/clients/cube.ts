// Stub: the real client would POST the query to the Cube REST API.
export interface CubeQuery {
  measures?: string[];
  dimensions?: string[];
  timeDimensions?: { dimension: string; granularity?: string; dateRange?: string | string[] }[];
  filters?: { member: string; operator: string; values?: string[] }[];
  limit?: number;
}

export const CUBE_META = {
  views: {
    revenue: {
      measures: ['revenue', 'paid_orders'],
      dimensions: ['paid_at', 'order_type', 'customers_country', 'customers_acquisition_channel'],
    },
    customers_overview: {
      measures: ['customers', 'paying_customers'],
      dimensions: ['signup_at', 'first_paid_at', 'country', 'acquisition_channel'],
    },
    subscriptions_overview: {
      measures: ['subscriptions', 'active_subscriptions', 'active_mrr'],
      dimensions: ['subject', 'status', 'plan_months', 'started_at'],
    },
    bookings_overview: {
      measures: ['total_bookings', 'lessons_attended', 'demos_attended', 'demos_no_show', 'demo_show_up_rate'],
      dimensions: ['tutor_id', 'booking_type', 'status', 'scheduled_at'],
    },
  },
};

export async function cubeLoad(query: CubeQuery): Promise<Record<string, unknown>[]> {
  return [{ stub: true, query }];
}
