import { z } from 'zod';

const nameRegex = /^[А-Яа-яЁёA-Za-z\-' ]+$/;
const carNumberRegex = /^[АВЕКМНОРСТУХABEKMHOPCTYX]\d{3}[АВЕКМНОРСТУХABEKMHOPCTYX]{2}\d{2,3}$/i;

export function makeRegistrationSchema({
  require_phone,
  require_car_number,
}: {
  require_phone: boolean;
  require_car_number: boolean;
}) {
  return z.object({
    last_name: z
      .string()
      .min(1, 'Введите фамилию')
      .max(50, 'Фамилия не должна превышать 50 символов')
      .regex(nameRegex, 'Фамилия содержит недопустимые символы'),
    first_name: z
      .string()
      .min(1, 'Введите имя')
      .max(50, 'Имя не должно превышать 50 символов')
      .regex(nameRegex, 'Имя содержит недопустимые символы'),
    middle_name: z
      .string()
      .refine((val) => !val || val.length <= 50, 'Отчество не должно превышать 50 символов')
      .refine(
        (val) => !val || nameRegex.test(val),
        'Отчество содержит недопустимые символы',
      )
      .optional(),
    email: z
      .string()
      .min(1, 'Введите email')
      .refine(
        (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        'Введите корректный email',
      ),
    phone: require_phone
      ? z.string().min(10, 'Введите номер телефона (минимум 10 символов)')
      : z.string().optional(),
    car_number: require_car_number
      ? z.string().regex(carNumberRegex, 'Введите номер в формате А123БВ77')
      : z.string().optional(),
  });
}

const _ref = makeRegistrationSchema({ require_phone: false, require_car_number: false });
export type RegistrationFormValues = z.infer<typeof _ref>;
