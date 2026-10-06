# Portfolio V2 link audit · October 6, 2026

## Local behavior

Both root and `/portfolio-v2` exports check every rendered local asset and anchor. Browser coverage requests all local action URLs, checks the selected résumé bytes, validates nonempty project action names, exercises every drawer destination, checks safe new-tab attributes and verifies email/telephone targets without sending mail or starting a call. Footer icons are decorative so link names are read once. The phone number now has a `tel:` action.

## Public project and social destinations

- **3D Portfolio:** the owner authorized anyone-with-the-link access. The Site owner confirmed public access revision 2; an independent anonymous HTTP request returned200 with the 3D Portfolio title and no login gate. The featured card now links to `https://engineering-3d-portfolio.storres788559.chatgpt.site`.
- **Portfolio V2, Stack Inventory, Nexus and Directory Structure Generator source repositories:** GitHub metadata confirms all four linked repositories are public.
- **Stack Inventory:** returned200 after redirecting to its login page. Its card correctly says sign-in required; no login was performed.
- **GitHub profile:** returned200 with the expected profile title.
- **Instagram:** returned200 with the expected account title; authenticated interactions were not exercised.
- **Discord:** its profile route returned200; the client-rendered account view was not independently authenticated or exercised.
- **LinkedIn:** returned999 to the automated reader. That restriction is not evidence of a broken profile link; the URL also matches the selected résumé.
- **Portfolio V2 live site:** the lowercase repository name is restored. Home/résumé returned404 before the authorized new release, while a lowercase CSS file returned200. Deployment restoration must be checked after merge rather than treating the pre-release error as a reason to change the correct base path.

All eight active RSS sources load during CI builds. Dynamic article links are normalized to safe HTTPS destinations and rendered as source links; individual third-party article pages are not all authenticated or tested. No private repository or still-private Site link is published. HTTP success alone does not certify every external site's full functionality.
