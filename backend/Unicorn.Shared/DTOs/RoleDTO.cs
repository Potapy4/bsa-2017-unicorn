﻿using System.Collections.Generic;

namespace Unicorn.Core.DTOs
{
    public class RoleDTO
    {
        public long Id { get; set; }

        public string Name { get; set; }

        public ICollection<AccountDTO> Accounts { get; set; }
    }
}
