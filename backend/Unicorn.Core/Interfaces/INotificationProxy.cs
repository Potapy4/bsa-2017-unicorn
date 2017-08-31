﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Unicorn.Shared.DTOs.Notification;

namespace Unicorn.Core.Interfaces
{
    public interface INotificationProxy
    {
        Task SendNotification(long accountId, NotificationDTO notification);
        Task RefreshOrdersForAccount(long accountId);
    }
}