namespace TimeAndAttendance.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public DateOnly JoiningDate { get; set; }
        public DateOnly? ResignationDate { get; set; }
    }
}
