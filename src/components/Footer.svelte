<script lang="ts">
	import { Instagram, Facebook } from '@lucide/svelte';
</script>

<footer
	class="w-full flex flex-col items-center justify-center self-end gap-2 py-6 bg-white border-t border-dark-10 mt-10"
>
	<div class="flex gap-4">
		<a
			href="https://instagram.com/neworld_ia"
			target="_blank"
			rel="noopener"
			aria-label="Instagram"
			class="hover:opacity-80 transition-opacity"
		>
			<Instagram size={24} />
		</a>
		<a
			href="https://www.facebook.com/share/16MeuejK5N"
			target="_blank"
			rel="noopener"
			aria-label="Facebook"
			class="hover:opacity-80 transition-opacity"
		>
			<Facebook size={24} />
		</a>
	</div>
	<span class="text-xs text-foreground-alt">
		&copy; {new Date().getFullYear()} Neworld
		<!-- <button
			class="text-xs text-foreground-alt hover:cursor-pointer"
			onclick={async () => {
				await authClient.signIn.social({
					provider: 'google'
				});
			}}
		>
			SignIn
		</button> -->
	</span>
</footer>
