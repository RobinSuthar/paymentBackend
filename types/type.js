import zod from "zod";

const SignInSchemaZod = zod.object({
  firstName: zod.string().min(1).max(30),
  lastName: zod.string().min(1).max(30),
  userName: zod.string().min(1).max(30),
  password: zod.string().min(8).max(30),
});

export default SignInSchemaZod;
