﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Unicorn.DataAccess.Entities
{
    public class ContactProvider
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }

        public bool IsDeleted { get; set; }
    }
}