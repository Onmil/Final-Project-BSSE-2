// src/mocks/supabaseMock.ts
export const supabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        order: async () => ({
          data: [],
          error: null,
        }),
      }),
    }),
  }),
};