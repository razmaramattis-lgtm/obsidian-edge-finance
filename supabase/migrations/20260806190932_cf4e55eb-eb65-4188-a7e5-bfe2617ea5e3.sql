UPDATE public.blog_posts
SET meta_description = 'Kontoplan NS 4102 forklart enkelt: alle 8 kontoklasser, de mest brukte kontonumrene og MVA-kodene. Søk i komplett kontoplan og finn riktig konto.',
    content = replace(
      content,
      '<p>Under går vi gjennom hver kontoklasse, de kontonumrene du bruker oftest i praksis, hvordan MVA-kodene henger sammen med kontoplanen, og vanlige spørsmål.</p>',
      '<p>Under går vi gjennom hver kontoklasse, de kontonumrene du bruker oftest i praksis, hvordan MVA-kodene henger sammen med kontoplanen, og vanlige spørsmål.</p>
<p><strong>Leter du etter én bestemt konto?</strong> <a href="/ressurser/kontohjelp">Søk i komplett kontoplan</a> — skriv inn en utgift, et begrep eller et kontonummer, så viser vi hvor det hører hjemme.</p>'
    )
WHERE slug = 'kontoplan-ns-4102-oppbygging';