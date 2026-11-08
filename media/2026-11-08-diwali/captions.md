# Diwali 2026: captions and settings

Sunday 8 November 2026 is both Diwali (Lakshmi Puja in the evening) and Tamil Deepavali. The owner chose "Happy Diwali" alone (8 November); #Deepavali stays as a hashtag. Peers' greetings lean on stock phrases ("joy, success and prosperity", "from all of us at"), so ours don't.

## 11:00 IST: Instagram carousel (2 × 1080 × 1350) + Story, LinkedIn document ([post.json](post.json))

Instagram caption (20 words before the hashtags; the greeting sits in the first 125 characters, before "more"):

> Happy Diwali to everyone celebrating today.
>
> One flame lights the next. Wishing you and your family a bright year ahead.
>
> #Diwali #Deepavali #HappyDiwali

Slides, with their alt text:

1. **Two glass diyas, one flame passing between them.** "Happy Diwali. One flame lights the next."
   Alt text: Two clear glass diyas on warm paper, one flame passing from one wick to the other. Text: Happy Diwali. One flame lights the next. hitroo.
2. **Seven lit glass diyas in a row.** "A bright year ahead. For you and yours."
   Alt text: Seven lit clear glass diyas in a diagonal row on warm paper. Text: A bright year ahead. For you and yours. hitroo.

A third slide (a glass diya on an ember kolam, "Happy Deepavali. From Chennai.") was dropped at review on 8 November; its photo is still in `art/`.

Story: the 12.5-second Reel video (video Stories reach more than still ones). A still Story is also ready (`export/upload/hitroo-diwali-2026-story.jpg`: the single glass diya, "Happy Diwali. One flame lights the next.").

LinkedIn page: the two slides as a PDF document titled "Happy Diwali from hitroo".

> Happy Diwali to everyone celebrating today.
>
> Tonight, lamps are lit one from another. One flame lights the next.
>
> Wishing you, your family and your teams a bright year ahead.
>
> #Diwali #Deepavali

## 18:00 IST: Instagram Reel ([reel.json](reel.json))

12.5 seconds, 1080 × 1920, built with HyperFrames in [reel/](reel/) after the rg viral-shorts recipe (`~/Desktop/rg/viral-shorts/RECIPE.md`): motion from frame 0, something new every 1–3 s, a sound on every move.

1. **0–3.2 s:** the two diyas sharing one flame land with "Happy Diwali." already on screen. The caption types on, "One flame lights the next." arrives word by word, then the camera dives into the flame.
2. **3.2–8.3 s:** out of a flash, the seven glass diyas light one after another, front to back, on the music's half-beats. Each lamp blooms from grey into colour and its flame flares. "A bright year ahead. For you and yours." builds over it.
3. **8.3–12.5 s:** a single diya and the wordmark lettering in, then "Happy Diwali" and hitroo.com.

Sound:
- Music: "Lakshmi" (Epidemic Sound, fitted to length by Epidemic).
- Effects: a fire whoosh into the cut, a glass hit, a soft flame on each lamp (generated with ElevenLabs), a riser and a low impact under the name.
- Mixed to −14 LUFS with a true peak of −1.8 dBTP. This was measured, not listened to.

To change it: edit `reel/compositions/*.html` or `reel/work/mix.py`, then `npx hyperframes render` and mux `assets/audio/master.wav` (see `reel/work/mix.py`).

> One flame lights the next. Happy Diwali.
>
> #Diwali #Deepavali #HappyDiwali

## Why these times

At 11:00 the morning Deepavali rituals are over and the evening puja hasn't started. 18:00 matches Instagram's evening lift (Buffer, 2026). Spacing the two Instagram feed posts keeps them from competing.
