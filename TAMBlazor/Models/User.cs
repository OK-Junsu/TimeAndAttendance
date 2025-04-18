using System.ComponentModel.DataAnnotations;

namespace TAMBlazor.Models
{
    /// <summary>
    /// 사용자 정보
    /// </summary>
    public class User : PostInfo
    {
        /// <summary>
        /// 이름
        /// </summary>
        [Required(ErrorMessage = "Name is required.")]
        public required string Name { get; set; }
        /// <summary>
        /// 입사일
        /// </summary>
        public DateOnly JoiningDate { get; set; }
        /// <summary>
        /// 퇴사일
        /// </summary>
        public DateOnly? ResignationDate { get; set; }


        /// <summary>
        /// 덮어쓰기
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="modifiedItem"></param>
        /// <exception cref="InvalidOperationException"></exception>
        public override void Overwrite<T>(T modifiedItem)
        {
            if (modifiedItem is User user)
            {
                Name = user.Name;
                JoiningDate = user.JoiningDate;
                ResignationDate = user.ResignationDate;
            }
            else
                throw new InvalidOperationException(OverwriteErrorMessage);
        }
    }
}
