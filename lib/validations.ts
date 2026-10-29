import { z } from "zod";

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  fullDescription: z.string().optional().default(""),
  price: z.number().min(0, "Price must be non-negative"),
  costPrice: z.number().min(0).optional(),
  category: z.string().optional().default("fresh"),
  legend: z.string().optional().default(""),
  accent: z.string().optional().default("#C41E3A"),
  stock: z.number().int().min(0).optional().default(0),
  images: z.array(z.string()).optional().default([]),
  notes: z
    .object({
      top: z.array(z.string()).optional().default([]),
      middle: z.array(z.string()).optional().default([]),
      base: z.array(z.string()).optional().default([]),
    })
    .optional()
    .default({ top: [], middle: [], base: [] }),
  offer: z
    .object({
      label: z.string().optional(),
      active: z.boolean().optional(),
      title: z.string().optional(),
      price: z.number().optional(),
      badge: z.string().optional(),
    })
    .optional(),
  originalPrice: z.number().optional(),
  discountPercent: z.number().int().min(0).max(100).optional(),
});

export const orderSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.string().email("Invalid email"),
  customerPhone: z.string().min(5, "Phone is required"),
  contactMethod: z.enum(["telegram", "whatsapp", "max"]).default("telegram"),
  customerAddress: z.string().min(1, "Address is required"),
  items: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      quantity: z.number().int().min(1),
      price: z.number().min(0),
    })
  ).min(1, "At least one item required"),
});

export const orderStatusSchema = z.object({
  id: z.string(),
  status: z.enum(["new", "processing", "completed", "cancelled"]),
  trackingNumber: z.string().max(100).optional().nullable(),
});
export const reviewSchema = z.object({
  productId: z.string().min(1),
  authorName: z.string().min(1).max(80),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(1).max(2000),
});

export const customerRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(128),
  name: z.string().max(80).optional(),
});

export const customerLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(128),
});

export const giftCardCheckSchema = z.object({
  code: z.string().min(1).max(64),
});

export const giftCardRedeemSchema = z.object({
  code: z.string().min(1).max(64),
  amount: z.number().positive(),
});

export const messengerSettingsSchema = z.object({
  tgToken: z.string().max(200).optional().default(""),
  tgChatId: z.string().max(100).optional().default(""),
  waNumber: z.string().max(50).optional().default(""),
});

export const bannerSchema = z.object({
  title: z.string().min(1).max(200),
  subtitle: z.string().max(500).optional().default(""),
  endDate: z.string().optional(),
  bgColor: z.string().max(20).optional().default("#E8B4B8"),
  textColor: z.string().max(20).optional().default("#3D2B1F"),
  active: z.boolean().optional().default(true),
  link: z.string().max(500).optional().default("#catalog"),
  linkText: z.string().max(50).optional().default("Смотреть"),
  discount: z.number().min(0).max(100).optional().default(0),
  selectedProductIds: z.array(z.string()).optional().default([]),
});

export const bannerUpdateSchema = bannerSchema.partial().extend({ id: z.string().min(1) });


export const giftCardCreateSchema = z.object({
  amount: z.number().int().positive(),
  code: z.string().min(1).max(64).optional(),
});
