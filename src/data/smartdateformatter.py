# This Python file uses the following encoding: utf-8
"""
http://stackoverflow.com/questions/3002155/matplotlib-autodatelocator-custom-date-formatting

asked Jun 8 2010 at 23:41
jawonlee

I'm using Matplotlib to dynamically generate .png charts from a database. The
user may set as the x-axis any given range of datetimes, and I need to account
for all of it. While Matplotlib has the dates.AutoDateLocator(), I want the
datetime format printed on the chart to be context-specific - e.g. if the user
is charting from 3 p.m. to 5 p.m., the year/month/day information doesn't need
to be displayed. Right now, I'm manually creating Locator and Formatter objects
thusly:
def get_ticks(start, end):
    from datetime import timedelta as td
    delta = end - start

    if delta <= td(minutes=10):
        loc = mdates.MinuteLocator()
        fmt = mdates.DateFormatter('%I:%M %p')
    elif delta <= td(minutes=30):
        loc = mdates.MinuteLocator(byminute=range(0,60,5))
        fmt = mdates.DateFormatter('%I:%M %p')
    elif delta <= td(hours=1):
        loc = mdates.MinuteLocator(byminute=range(0,60,15))
        fmt = mdates.DateFormatter('%I:%M %p')
    elif delta <= td(hours=6):
        loc = mdates.HourLocator()
        fmt = mdates.DateFormatter('%I:%M %p')
    elif delta <= td(days=1):
        loc = mdates.HourLocator(byhour=range(0,24,3))
        fmt = mdates.DateFormatter('%I:%M %p')
    elif delta <= td(days=3):
        loc = mdates.HourLocator(byhour=range(0,24,6))
        fmt = mdates.DateFormatter('%I:%M %p')
    elif delta <= td(weeks=2):
        loc = mdates.DayLocator()
        fmt = mdates.DateFormatter('%b %d')
    elif delta <= td(weeks=12):
        loc = mdates.WeekdayLocator()
        fmt = mdates.DateFormatter('%b %d')
    elif delta <= td(weeks=52):
        loc = mdates.MonthLocator()
        fmt = mdates.DateFormatter('%b')
    else:
        loc = mdates.MonthLocator(interval=3)
        fmt = mdates.DateFormatter('%b %Y')
    return loc,fmt

Is there a better way of doing this?
python matplotlib

===========================================================

edited Jun 12 2010 at 6:00
answered Jun 9 2010 at 18:15
Jouni K. Seppänen
6,5561126

Does AutoDateFormatter do what you want? Even if it doesn't, you may want to
take a look at its source code for a somewhat more compact way of implementing
the choice of format string.

In the released version, you cannot customize the per-level formats, but in the
development code you can. You could probably just copy the version from the
trunk into your own code.
  
===========================================================
Unfortunately, my problem with the AutoDateFormatter is that it won't let you
custom-format various levels. So its minute-level formatting is going to be in
"HH:MM:SS Timezone", whether you like it or not. – jawonlee Jun 11 2010 at 23:29

===========================================================
  
I edited the answer to mention that the development version is better in this
respect than the released one. – Jouni K. Seppänen Jun 12 2010 at 6:01
"""

#####
# EOF
