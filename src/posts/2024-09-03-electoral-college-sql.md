---
title: Bringing SQL to a Python Fight
slug: sql-to-a-python-fight
date: 2024-09-03
tags:
  - Data
---
I read [two](https://leancrew.com/all-this/2024/08/pandas-and-the-electoral-college/) [posts](https://leancrew.com/all-this/2024/08/the-electoral-college-again-this-time-with-aggregation/) last week about the use of [Pandas](https://pandas.pydata.org/), the preeminent data analysis tool for the Python programming language. Working with data is my day job now, so it was an interesting read—and of course it got me thinking about how I’d approach the problem with my preferred tools.

This will be the most technical piece I’ve written here, but if you’re interested, read on.

## The Problem
In these posts, Dr. Drang was documenting the creation of a table for [a previous blog post](https://leancrew.com/all-this/2024/08/what-i-didn-t-learn-about-the-electoral-college/), in which he compared the percentage of the US population by state to each state’s percentage of the Electoral College. He started with [a CSV](https://leancrew.com/all-this/downloads/states.csv) containing a list of states with their name, abbreviation, population, and number of electors. The header and first ten rows look like this:

|        State         |  Abbrev  |   Population |   Electors |
|:--------------------:|:--------:|-------------:|-----------:|
|       Alabama        |    AL    |      5108468 |          9 |
|        Alaska        |    AK    |       733406 |          3 |
|       Arizona        |    AZ    |      7431344 |         11 |
|       Arkansas       |    AR    |      3067732 |          6 |
|      California      |    CA    |     38965193 |         54 |
|       Colorado       |    CO    |      5877610 |         10 |
|     Connecticut      |    CT    |      3617176 |          7 |
|       Delaware       |    DE    |      1031890 |          3 |
| District of Columbia |    DC    |       678972 |          3 |
|       Florida        |    FL    |     22610726 |         30 |

From that he generated this table for his blog post:

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

Both Dr. Drang and I write our posts in Markdown, so the plaintext version of the table to be generated looks like this:

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
I have used Python for some data transformation/analysis,[^python] but my go-to language for working with data is [SQL](https://en.wikipedia.org/wiki/SQL). Python, for me, is a fallback for things that involve more scripting (like loops or complex functions). But for most data analysis needs, I find SQL better suited to the job.

For processing, when I’m not working in a cloud data warehouse like [Snowflake](https://www.snowflake.com/en/), I often turn to [DuckDB](https://duckdb.org/)—in its own words, “a fast in-process analytical database”. DuckDB can import a variety of file and database formats, or even query them directly. DuckDB can also be used within Python, which allows for workflows combining DuckDB and Pandas.

## The Solution
I worked through this a couple different ways. The first was more step-by-step, and then I condensed that down to a one-shot query, which is what I then used in a Python script to generate the final Markdown table.[^md]

In DuckDB, I could query the contents of the CSV with 

```sql
select * from "states.csv"
```

DuckDB has a convenient syntax for those `select *` queries—namely, you can drop the `select *`:

```sql
from "states.csv"
```

So to import the file to a new table in the database, I wrote:

```sql
create table states as from "states.csv";
```

After this, the first query I wrote gave me something like Drang’s first summary table:

```sql
create or replace view agg_states as

with totals as (
     select sum(population) as total_pop,
            sum(electors) as total_electors
       from states
)

select electors,
       string_agg(abbrev, ', ') as states,
       sum(population) as pop_sum,
       sum(population/total_pop) as pop_pct,
       sum(electors) as electors_sum,
       sum(electors/total_electors) as ec_pct

  from states, totals
 group by all;
 ```

When I query that view[^view] DuckDB outputs the following:

```
┌──────────┬────────────────────────────┬──────────┬──────────────────────┬──────────────┬──────────────────────┐
│ Electors │           states           │ pop_sum  │       pop_pct        │ electors_sum │        ec_pct        │
│  int64   │          varchar           │  int128  │        double        │    int128    │        double        │
├──────────┼────────────────────────────┼──────────┼──────────────────────┼──────────────┼──────────────────────┤
│        3 │ AK, DE, DC, ND, SD, VT, WY │  5379033 │ 0.016060895111876104 │           21 │ 0.039033457249070626 │
│        4 │ HI, ID, ME, MT, NH, RI, WV │ 10196485 │ 0.030445003050700387 │           28 │ 0.052044609665427496 │
│        5 │ NE, NM                     │  4092750 │ 0.012220268674524016 │           10 │  0.01858736059479554 │
│        6 │ AR, IA, KS, MS, NV, UT     │ 18766882 │  0.05603477862637313 │           36 │  0.06691449814126393 │
│        7 │ CT, OK                     │  7671000 │  0.02290432618710494 │           14 │ 0.026022304832713755 │
│        8 │ KY, LA, OR                 │ 13333261 │  0.03981089285383978 │           24 │  0.04460966542750929 │
│        9 │ AL, SC                     │ 10482023 │ 0.031297571880163765 │           18 │  0.03345724907063197 │
│       10 │ CO, MD, MN, MO, WI         │ 29902889 │  0.08928503762127392 │           50 │   0.0929368029739777 │
│       11 │ AZ, IN, MA, TN             │ 28421431 │  0.08486165119649276 │           44 │  0.08178438661710037 │
│       12 │ WA                         │  7812880 │ 0.023327956196155443 │           12 │ 0.022304832713754646 │
│       13 │ VA                         │  8715698 │ 0.026023620119971076 │           13 │ 0.024163568773234202 │
│       14 │ NJ                         │  9290841 │  0.02774090116236843 │           14 │ 0.026022304832713755 │
│       15 │ MI                         │ 10037261 │ 0.029969586751284978 │           15 │ 0.027881040892193308 │
│       16 │ GA, NC                     │ 21864718 │  0.06528440008617711 │           32 │  0.05947955390334572 │
│       17 │ OH                         │ 11785935 │  0.03519083557033198 │           17 │ 0.031598513011152414 │
│       19 │ IL, PA                     │ 25511372 │    0.076172700530384 │           38 │  0.07063197026022305 │
│       28 │ NY                         │ 19571216 │  0.05843638575704434 │           28 │  0.05204460966542751 │
│       30 │ FL                         │ 22610726 │  0.06751185551183085 │           30 │ 0.055762081784386616 │
│       40 │ TX                         │ 30503301 │  0.09107776768184646 │           40 │  0.07434944237918216 │
│       54 │ CA                         │ 38965193 │  0.11634356543025655 │           54 │  0.10037174721189591 │
├──────────┴────────────────────────────┴──────────┴──────────────────────┴──────────────┴──────────────────────┤
│ 20 rows                                                                                             6 columns │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

I made something matching the format of Dr. Drang’s table (but not in Markdown) by running another query based on the view:

```sql
select electors as "Electors",
       states as "States",
       printf('%.2f%s', pop_pct*100, '%') as "Pop Pct",
       printf('%.2f%s', ec_pct*100, '%') as "EC Pct"
  from agg_states;
```

This gives me:

```
┌──────────┬────────────────────────────┬─────────┬─────────┐
│ Electors │           States           │ Pop Pct │ EC Pct  │
│  int64   │          varchar           │ varchar │ varchar │
├──────────┼────────────────────────────┼─────────┼─────────┤
│        3 │ AK, DE, DC, ND, SD, VT, WY │ 1.61%   │ 3.90%   │
│        4 │ HI, ID, ME, MT, NH, RI, WV │ 3.04%   │ 5.20%   │
│        5 │ NE, NM                     │ 1.22%   │ 1.86%   │
│        6 │ AR, IA, KS, MS, NV, UT     │ 5.60%   │ 6.69%   │
│        7 │ CT, OK                     │ 2.29%   │ 2.60%   │
│        8 │ KY, LA, OR                 │ 3.98%   │ 4.46%   │
│        9 │ AL, SC                     │ 3.13%   │ 3.35%   │
│       10 │ CO, MD, MN, MO, WI         │ 8.93%   │ 9.29%   │
│       11 │ AZ, IN, MA, TN             │ 8.49%   │ 8.18%   │
│       12 │ WA                         │ 2.33%   │ 2.23%   │
│       13 │ VA                         │ 2.60%   │ 2.42%   │
│       14 │ NJ                         │ 2.77%   │ 2.60%   │
│       15 │ MI                         │ 3.00%   │ 2.79%   │
│       16 │ GA, NC                     │ 6.53%   │ 5.95%   │
│       17 │ OH                         │ 3.52%   │ 3.16%   │
│       19 │ IL, PA                     │ 7.62%   │ 7.06%   │
│       28 │ NY                         │ 5.84%   │ 5.20%   │
│       30 │ FL                         │ 6.75%   │ 5.58%   │
│       40 │ TX                         │ 9.11%   │ 7.43%   │
│       54 │ CA                         │ 11.63%  │ 10.04%  │
├──────────┴────────────────────────────┴─────────┴─────────┤
│ 20 rows                                         4 columns │
└───────────────────────────────────────────────────────────┘
```

Finally, I rewrote the query to cut out the intermediate steps and go straight from the CSV to the final results:

```sql
with totals as (
     -- Sum population and electors for all states
     select sum(population) as total_pop,
            sum(electors) as total_electors
       from 'states.csv'
)

select electors as "Electors",
       string_agg(abbrev, ', ') as "States",
       sum(population/total_pop) as "Pop Pct",
       sum(electors/total_electors) as "EC Pct"

  from 'states.csv', totals
 group by all
 order by all;
```

Personally I find this far more elegant a solution for the aggregation of the data. To get it into a Markdown table, we can run this SQL from Python and use the `to_markdown` function on the resulting Pandas dataframe:

```py
import duckdb
import pandas

df = duckdb.sql("\
     with totals as (\
          select sum(population) as total_pop,\
                 sum(electors) as total_electors\
            from 'states.csv'\
     )\
     select electors as 'Electors',\
            string_agg(abbrev, ', ') as 'States',\
            sum(population/total_pop) as 'Pop Pct',\
            sum(electors/total_electors) as 'EC Pct'\
       from 'states.csv', totals\
      group by all\
      order by all;\
   ").df()

print(df.to_markdown(index=False, floatfmt='.2%',\
      colalign=['center', 'center', 'right', 'right'] ))
```

And, running that:

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

[^python]: Some Pandas, but more commonly [the Snowpark API](https://docs.snowflake.com/en/developer-guide/snowpark/python/index), which is Pandas-inspired but native to Snowflake.

[^md]: Exporting to Markdown is presumably not a common use-case for DuckDB. When I’m doing quick analysis I generally just want to see the results directly, or maybe exported to a CSV which can be imported to spreadsheet applications like Excel. For data *transformation*, which is the core of my day job, I use [dbt](https://www.getdbt.com/) to create downstream tables or views in the warehouse, which can then be queried by external reporting or visualization applications (such as dashboards).

[^view]: If you’re unfamiliar with SQL-based databases, a view is like a table, except instead of storing the resulting data, the original query is stored and then executed again anytime the view is referenced in another query.