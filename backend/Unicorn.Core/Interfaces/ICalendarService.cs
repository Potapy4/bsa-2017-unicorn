﻿using System.Threading.Tasks;
using Unicorn.Shared.DTOs;

namespace Unicorn.Core.Interfaces
{
    public interface ICalendarService
    {
        Task<CalendarDTO> CreateCalendar(long accountId);
        Task SaveCalendar(CalendarDTO calendar);
        Task<CalendarDTO> GetCalendarById(long calendarId);
        Task<CalendarDTO> GetCalendarByAccountId(long accountId);
    }
}