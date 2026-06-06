<h1>Blog</h1>
<ul class="blog-list">
	<li><a href="/blog/gut-health-101">Gut Health 101</a></li>
	<li><a href="/blog/managing-stress">Managing Stress</a></li>
	<li><a href="/blog/sleep-hygiene">Sleep Hygiene</a></li>
</ul>

<style>
	:scope {
		max-width: 1160px;
		margin: 0 auto;
	}
	h1 {
		font-size: clamp(2rem, 5vw, 3.5rem);
		letter-spacing: -0.02em;
	}
	.blog-list {
		list-style: none;
		padding: 0;
		margin-top: 2rem;
	}
	.blog-list li {
		margin-bottom: 1rem;
	}
	.blog-list a {
		display: block;
		padding: 1.25rem;
		border-radius: 12px;
		text-decoration: none;
		color: #111;
		font-weight: 500;
		font-size: 1.125rem;
		border: 1.5px solid rgba(20,19,15,.12);
		transition: all 0.2s;
	}
	.blog-list a:hover {
		background: rgba(20,19,15,.04);
		box-shadow: 0 4px 16px rgba(0,0,0,0.06);
	}
	@media (max-width: 540px) {
		.blog-list a { padding: 1rem; }
	}
</style>