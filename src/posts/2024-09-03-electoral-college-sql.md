---
title: Bringing SQL to a Python Fight
date: 2024-09-03T16:13:00 +00:00
draft: true
slug: bringing-sql-to-a-python-fight
tags:
  - Technology
  - Data
---
A couple weeks ago I read [two](https://leancrew.com/all-this/2024/08/pandas-and-the-electoral-college/?ref=seanlunsford.com) [posts](https://leancrew.com/all-this/2024/08/the-electoral-college-again-this-time-with-aggregation/?ref=seanlunsford.com) by Dr. Drang. He was documenting the creation of a table for a [previous blog post](https://leancrew.com/all-this/2024/08/what-i-didn-t-learn-about-the-electoral-college/?ref=seanlunsford.com) using [Pandas](https://pandas.pydata.org/), a data analysis package for [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\)). Working with data is my day job now, so it was interesting to follow his process and the updates he made in the follow-up post. Of course I got [nerd-sniped](https://xkcd.com/356/), and just had to work out how I’d approach the problem with my own preferred tools.

This will be the most technical piece I’ve written here, so if wrangling code and crunching numbers sounds like a good time, read on.\[^ns\]

\[^ns\]: Joke’s on me: writing this post and updating my website to handle all these tables and code blocks nicely ended up being way more involved than solving the original problem.

## The Problem

[The original post](https://leancrew.com/all-this/2024/08/what-i-didn-t-learn-about-the-electoral-college/?ref=seanlunsford.com)—and the table in question—was looking at states’ percentage of the Electoral College vote compared to their population as a percentage of the US total. He started with [a CSV](https://leancrew.com/all-this/downloads/states.csv?ref=seanlunsford.com) containing data for each state. The header and first ten rows look like this:

| State | Abbrev | Population | Electors |
| --- | --- | --- | --- |
| Alabama | AL  | 5108468 | 9   |
| Alaska | AK  | 733406 | 3   |
| Arizona | AZ  | 7431344 | 11  |
| Arkansas | AR  | 3067732 | 6   |
| California | CA  | 38965193 | 54  |
| Colorado | CO  | 5877610 | 10  |
| Connecticut | CT  | 3617176 | 7   |
| Delaware | DE  | 1031890 | 3   |
| District of Columbia | DC  | 678972 | 3   |
| Florida | FL  | 22610726 | 30  |

From that he calculated this table for his post:

| Electors | States | Pop Pct | EC Pct |
| --- | --- | --- | --- |
| 3   | AK, DE, DC, ND, SD, VT, WY | 1.61% | 3.90% |
| 4   | HI, ID, ME, MT, NH, RI, WV | 3.04% | 5.20% |
| 5   | NE, NM | 1.22% | 1.86% |
| 6   | AR, IA, KS, MS, NV, UT | 5.60% | 6.69% |
| 7   | CT, OK | 2.29% | 2.60% |
| 8   | KY, LA, OR | 3.98% | 4.46% |
| 9   | AL, SC | 3.13% | 3.35% |
| 10  | CO, MD, MN, MO, WI | 8.93% | 9.29% |
| 11  | AZ, IN, MA, TN | 8.49% | 8.18% |
| 12  | WA  | 2.33% | 2.23% |
| 13  | VA  | 2.60% | 2.42% |
| 14  | NJ  | 2.77% | 2.60% |
| 15  | MI  | 3.00% | 2.79% |
| 16  | GA, NC | 6.53% | 5.95% |
| 17  | OH  | 3.52% | 3.16% |
| 19  | IL, PA | 7.62% | 7.06% |
| 28  | NY  | 5.84% | 5.20% |
| 30  | FL  | 6.75% | 5.58% |
| 40  | TX  | 9.11% | 7.43% |
| 54  | CA  | 11.63% | 10.04% |

Both Dr. Drang and I write our posts in [Markdown](https://en.wikipedia.org/wiki/Markdown), so the plaintext version of the table looks like this:

```md
|  Electors  |           States           |   Pop Pct |   EC Pct |
|:----------:|:--------------------------:|----------:|---------:|
|     3      | AK, DE, DC, ND, SD, VT, WY |     1.61% |    3.90% |
|     4      | HI, ID, ME, MT, NH, RI, WV |     3.04% |    5.20% |
|     5      |           NE, NM           |     1.22% |    1.86% |
|     6      |   AR, IA, KS, MS, NV, UT   |     5.60% |    6.69% |
|     7      |           CT, OK           |     2.29% |    2.60% |
|     8      |         KY, LA, OR         |     3.98% |    4.46% |
|     9      |           AL, SC           |     3.13% |    3.35% |
|     10     |     CO, MD, MN, MO, WI     |     8.93% |    9.29% |
|     11     |       AZ, IN, MA, TN       |     8.49% |    8.18% |
|     12     |             WA             |     2.33% |    2.23% |
|     13     |             VA             |     2.60% |    2.42% |
|     14     |             NJ             |     2.77% |    2.60% |
|     15     |             MI             |     3.00% |    2.79% |
|     16     |           GA, NC           |     6.53% |    5.95% |
|     17     |             OH             |     3.52% |    3.16% |
|     19     |           IL, PA           |     7.62% |    7.06% |
|     28     |             NY             |     5.84% |    5.20% |
|     30     |             FL             |     6.75% |    5.58% |
|     40     |             TX             |     9.11% |    7.43% |
|     54     |             CA             |    11.63% |   10.04% |
```

## The Tools

My go-to language for working with data is [SQL](https://en.wikipedia.org/wiki/SQL). I turn to Python\[^py\] for things that involve more scripting (like loops or complex functions). But for most data analysis needs, I find SQL better suited to the job.

\[^py\]: Some Pandas, but mostly [Snowpark Python](https://docs.snowflake.com/en/developer-guide/snowpark/python/index), which is Pandas-inspired but native to [Snowflake](https://www.snowflake.com/en/), which we use at work.

From personal projects to one-off data transformation/analysis tasks at work, I keep finding more and more uses for [DuckDB](https://duckdb.org/)—in its own words, “a fast in-process analytical database”. DuckDB can import (and export) a variety of file and database formats or even query them directly. It can also be used from within Python, which allows for workflows combining DuckDB and Pandas.

## The Solution

I worked through this a couple different ways. The first time through was more piece-by-piece, and then I condensed that down to a one-shot query, which is what I used in a (very short) Python script to generate the final Markdown table.

I started by importing the CSV to a new table in the database:\[^sql\]

```sql
create table states as from "states.csv";
```

\[^sql\]: To pick this apart a bit: I could read the contents of the file with `select * from "states.csv"`, which gives me every column (and row) of the data. DuckDB has a convenient syntax for those `select *` queries—namely, you can drop the `select *` and just type `from "states.csv"`. Here I’m taking it a step further and creating a table from the results of that query.

I queried that table to get something like Dr. Drang’s initial summary table.

```sql
with totals as (
     -- Sum population and electors for all states
     select sum(population) as total_pop,
            sum(electors) as total_electors
       from states
)

   select electors,
          string_agg(abbrev, ', ') as states,
          count(*) as num_states,
          sum(population) as population,
          sum(population/total_pop) as pop_pct,
          sum(electors) as electors_sum,
          sum(electors/total_electors) as ec_pct

     from states,
          totals
 group by electors;
```

This is where the meat of the aggregation happens.

In the first part, I sum the `population` and `electors` columns for the whole `states` table. This gives me a single-row result set which I use along with the `states` table in the second part.

The `group by electors` clause tells the query what to group, and all the other columns are aggregate functions for all rows (or states) with that number of electors. `string_agg` does the thing Dr. Drang wrote a custom lambda function for, combining the column values with a given separator—in this case, a comma and space.

Here’s DuckDB’s output:

```
┌──────────┬────────────────────────────┬────────────┬────────────┬──────────────────────┬──────────────┬──────────────────────┐
│ Electors │           states           │ num_states │ population │       pop_pct        │ electors_sum │        ec_pct        │
│  int64   │          varchar           │   int64    │   int128   │        double        │    int128    │        double        │
├──────────┼────────────────────────────┼────────────┼────────────┼──────────────────────┼──────────────┼──────────────────────┤
│        3 │ AK, DE, DC, ND, SD, VT, WY │          7 │    5379033 │ 0.016060895111876104 │           21 │ 0.039033457249070626 │
│        4 │ HI, ID, ME, MT, NH, RI, WV │          7 │   10196485 │ 0.030445003050700387 │           28 │ 0.052044609665427496 │
│        5 │ NE, NM                     │          2 │    4092750 │ 0.012220268674524016 │           10 │  0.01858736059479554 │
│        6 │ AR, IA, KS, MS, NV, UT     │          6 │   18766882 │  0.05603477862637313 │           36 │  0.06691449814126393 │
│        7 │ CT, OK                     │          2 │    7671000 │  0.02290432618710494 │           14 │ 0.026022304832713755 │
│        8 │ KY, LA, OR                 │          3 │   13333261 │  0.03981089285383978 │           24 │  0.04460966542750929 │
│        9 │ AL, SC                     │          2 │   10482023 │ 0.031297571880163765 │           18 │  0.03345724907063197 │
│       10 │ CO, MD, MN, MO, WI         │          5 │   29902889 │  0.08928503762127392 │           50 │   0.0929368029739777 │
│       11 │ AZ, IN, MA, TN             │          4 │   28421431 │  0.08486165119649276 │           44 │  0.08178438661710037 │
│       12 │ WA                         │          1 │    7812880 │ 0.023327956196155443 │           12 │ 0.022304832713754646 │
│       13 │ VA                         │          1 │    8715698 │ 0.026023620119971076 │           13 │ 0.024163568773234202 │
│       14 │ NJ                         │          1 │    9290841 │  0.02774090116236843 │           14 │ 0.026022304832713755 │
│       15 │ MI                         │          1 │   10037261 │ 0.029969586751284978 │           15 │ 0.027881040892193308 │
│       16 │ GA, NC                     │          2 │   21864718 │  0.06528440008617711 │           32 │  0.05947955390334572 │
│       17 │ OH                         │          1 │   11785935 │  0.03519083557033198 │           17 │ 0.031598513011152414 │
│       19 │ IL, PA                     │          2 │   25511372 │    0.076172700530384 │           38 │  0.07063197026022305 │
│       28 │ NY                         │          1 │   19571216 │  0.05843638575704434 │           28 │  0.05204460966542751 │
│       30 │ FL                         │          1 │   22610726 │  0.06751185551183085 │           30 │ 0.055762081784386616 │
│       40 │ TX                         │          1 │   30503301 │  0.09107776768184646 │           40 │  0.07434944237918216 │
│       54 │ CA                         │          1 │   38965193 │  0.11634356543025655 │           54 │  0.10037174721189591 │
├──────────┴────────────────────────────┴────────────┴────────────┴──────────────────────┴──────────────┴──────────────────────┤
│ 20 rows                                                                                                            7 columns │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

Finally, I rewrote the query to cut out the import step and select just the columns for the final table. For some reason, when doing it this way the table was no longer sorted by the electors column, even though it had been in the two-step query before. That can be remedied with `order by electors`:

```sql
with totals as (
        -- Sum population and electors for all states
     select sum(population) as total_pop,
            sum(electors) as total_electors
       from "states.csv"
)

   select electors as "Electors",
          string_agg(abbrev, ', ') as "States",
          sum(population/total_pop) as "Pop Pct",
          sum(electors/total_electors) as "EC Pct"

     from "states.csv",
          totals
 group by electors
 order by electors;
```

This gets closer, but it’s not Markdown yet:

```
┌──────────┬────────────────────────────┬──────────────────────┬──────────────────────┐
│ Electors │           States           │       Pop Pct        │        EC Pct        │
│  int64   │          varchar           │        double        │        double        │
├──────────┼────────────────────────────┼──────────────────────┼──────────────────────┤
│        3 │ AK, DE, DC, ND, SD, VT, WY │ 0.016060895111876104 │ 0.039033457249070626 │
│        4 │ HI, ID, ME, MT, NH, RI, WV │ 0.030445003050700387 │ 0.052044609665427496 │
│        5 │ NE, NM                     │ 0.012220268674524016 │  0.01858736059479554 │
│        6 │ AR, IA, KS, MS, NV, UT     │  0.05603477862637313 │  0.06691449814126393 │
│        7 │ CT, OK                     │  0.02290432618710494 │ 0.026022304832713755 │
│        8 │ KY, LA, OR                 │  0.03981089285383978 │  0.04460966542750929 │
│        9 │ AL, SC                     │ 0.031297571880163765 │  0.03345724907063197 │
│       10 │ CO, MD, MN, MO, WI         │  0.08928503762127392 │   0.0929368029739777 │
│       11 │ AZ, IN, MA, TN             │  0.08486165119649276 │  0.08178438661710037 │
│       12 │ WA                         │ 0.023327956196155443 │ 0.022304832713754646 │
│       13 │ VA                         │ 0.026023620119971076 │ 0.024163568773234202 │
│       14 │ NJ                         │  0.02774090116236843 │ 0.026022304832713755 │
│       15 │ MI                         │ 0.029969586751284978 │ 0.027881040892193308 │
│       16 │ GA, NC                     │  0.06528440008617711 │  0.05947955390334572 │
│       17 │ OH                         │  0.03519083557033198 │ 0.031598513011152414 │
│       19 │ IL, PA                     │    0.076172700530384 │  0.07063197026022305 │
│       28 │ NY                         │  0.05843638575704434 │  0.05204460966542751 │
│       30 │ FL                         │  0.06751185551183085 │ 0.055762081784386616 │
│       40 │ TX                         │  0.09107776768184646 │  0.07434944237918216 │
│       54 │ CA                         │  0.11634356543025655 │  0.10037174721189591 │
├──────────┴────────────────────────────┴──────────────────────┴──────────────────────┤
│ 20 rows                                                                   4 columns │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

To get it into a Markdown table, we can run this query from Python, convert it to a Pandas dataframe, and run that through the `to_markdown` function.

```python
import duckdb
import pandas

df = duckdb.sql("""
    with totals as (
         select sum(population) as total_pop,
                sum(electors) as total_electors
           from 'states.csv'
    )
       select electors as 'Electors',
              string_agg(abbrev, ', ') as 'States',
              sum(population/total_pop) as 'Pop Pct',
              sum(electors/total_electors) as 'EC Pct'
         from 'states.csv',
              totals
     group by electors
     order by electors;
""").df()

print(df.to_markdown(
    index=False,
    floatfmt='.2%',
    colalign=['center', 'center', 'right', 'right']
))
```

I’ve made two tweaks to the `to_markdown` call from Dr. Drang’s code. It was adding an index column by default, so I’ve disabled that. Second, since I’ve already renamed the columns in SQL, the `headers` parameter is no longer needed.

This code combines everything: reading from the CSV, transforming it to the new table, and converting the results (via Pandas) to Markdown. So all we have to do is run this script in the same working directory as `states.csv`.

```md
|  Electors  |           States           |   Pop Pct |   EC Pct |
|:----------:|:--------------------------:|----------:|---------:|
|     3      | AK, DE, DC, ND, SD, VT, WY |     1.61% |    3.90% |
|     4      | HI, ID, ME, MT, NH, RI, WV |     3.04% |    5.20% |
|     5      |           NE, NM           |     1.22% |    1.86% |
|     6      |   AR, IA, KS, MS, NV, UT   |     5.60% |    6.69% |
|     7      |           CT, OK           |     2.29% |    2.60% |
|     8      |         KY, LA, OR         |     3.98% |    4.46% |
|     9      |           AL, SC           |     3.13% |    3.35% |
|     10     |     CO, MD, MN, MO, WI     |     8.93% |    9.29% |
|     11     |       AZ, IN, MA, TN       |     8.49% |    8.18% |
|     12     |             WA             |     2.33% |    2.23% |
|     13     |             VA             |     2.60% |    2.42% |
|     14     |             NJ             |     2.77% |    2.60% |
|     15     |             MI             |     3.00% |    2.79% |
|     16     |           GA, NC           |     6.53% |    5.95% |
|     17     |             OH             |     3.52% |    3.16% |
|     19     |           IL, PA           |     7.62% |    7.06% |
|     28     |             NY             |     5.84% |    5.20% |
|     30     |             FL             |     6.75% |    5.58% |
|     40     |             TX             |     9.11% |    7.43% |
|     54     |             CA             |    11.63% |   10.04% |
```

Success!