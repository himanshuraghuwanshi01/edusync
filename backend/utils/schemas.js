import Joi from "joi";

// Auth schemas
export const registerSchema = Joi.object({
  name: Joi.string().required().min(2).max(50).messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must not exceed 50 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be valid",
    "string.empty": "Email is required",
  }),
  password: Joi.string().required().min(6).max(100).messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
  }),
  bio: Joi.string().max(500).optional(),
  subjects: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        proficiency: Joi.string()
          .valid("Beginner", "Intermediate", "Advanced")
          .required(),
      })
    )
    .optional(),
  availability: Joi.array()
    .items(
      Joi.object({
        day: Joi.string().required(),
        startTime: Joi.string().required(),
        endTime: Joi.string().required(),
      })
    )
    .optional(),
  learningStyle: Joi.object({
    visual: Joi.boolean().optional(),
    auditory: Joi.boolean().optional(),
    kinesthetic: Joi.boolean().optional(),
  }).optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email must be valid",
    "string.empty": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

// User schemas
export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  bio: Joi.string().max(500).optional(),
  avatar: Joi.string().uri().optional(),
  subjects: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        level: Joi.string()
          .valid("Beginner", "Intermediate", "Advanced")
          .required(),
      })
    )
    .optional(),
  availability: Joi.array()
    .items(
      Joi.object({
        day: Joi.string().required(),
        start_time: Joi.string().required(),
        end_time: Joi.string().required(),
      })
    )
    .optional(),
  learning_style: Joi.object({
    visual: Joi.boolean().optional(),
    auditory: Joi.boolean().optional(),
    kinesthetic: Joi.boolean().optional(),
  }).optional(),
});

// Match schemas
export const createMatchSchema = Joi.object({
  targetUserId: Joi.string().required().messages({
    "string.empty": "targetUserId is required",
  }),
});

export const updateMatchStatusSchema = Joi.object({
  status: Joi.string()
    .valid("accepted", "rejected")
    .required()
    .messages({
      "any.only": "Status must be either 'accepted' or 'rejected'",
    }),
});

// Session schemas
export const createSessionSchema = Joi.object({
  matchId: Joi.string().required().messages({
    "string.empty": "matchId is required",
  }),
  notes: Joi.string().max(1000).optional(),
});

// Feedback schema
export const createFeedbackSchema = Joi.object({
  sessionId: Joi.string().required(),
  partnerId: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required().messages({
    "number.min": "Rating must be at least 1",
    "number.max": "Rating must not exceed 5",
  }),
  comment: Joi.string().max(1000).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
});
