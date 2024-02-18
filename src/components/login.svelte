<script lang="ts">
    import { Label, Input, Checkbox, Button} from "flowbite-svelte";
    import { Register, Section } from "flowbite-svelte-blocks";

    export let errorMessage: string;
</script>
<div class="h-full w-[40%] m-auto py-[25%] translate-y-[-25%]">
  <Section name="login">
    <Register href="/">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <form class="flex flex-col space-y-6" action="/" method="POST">
          <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Login</h3>
          <Label class="space-y-2">
            <span>Username</span>
            <Input name="user" placeholder="John Doe" required />
          </Label>
          <Label class="space-y-2">
            <span>Your password</span>
            <Input type="password" name="password" placeholder="•••••" required />
          </Label>
          <Button type="submit" class="w-full1">Sign in</Button>
        </form>
        <p class="text-red-600">{errorMessage}</p>
      </div>
    </Register>
  </Section>
</div>
